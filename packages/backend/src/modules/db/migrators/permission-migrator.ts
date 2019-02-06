import replaceEnum from "sequelize-replace-enum-postgres";
import * as _ from "lodash";
import { Op, QueryInterface, Transaction } from "sequelize";

import { PermissionName, RoleName, Permission } from "../entities";
import { RoleDto, RolePermissionDto } from "../../auth";

export class PermissionMigrationPayloadData {
    permission: PermissionName;
    description?: string;
    acl: { [P in RoleName]: boolean };
}

export class PermissionMigrationPayloadOptions {
    trancation?: Transaction;
    transactional?: boolean;
}

export class PermissionMigrationUpPayload {
    data: PermissionMigrationPayloadData[];
    opts: PermissionMigrationPayloadOptions;
}

export class PermissionMigrationDownPayload {
    permissions: PermissionName[];
    opts: PermissionMigrationPayloadOptions;
}

/**
 *  PermissionMigrator Utility.
 *  Easy new permissoin setup.
 *  Motivation: each permission added required several steps identical steps: updating enumeration values, validtion and etc.
 *  @example // Migration File
 *
 *  require("ts-node/register"); // IMPORTANT: otherwise, your migration class won't be resolved
 *
 *  const { PermissionMigrator } = require("../migration-util");
 *  const permission = "user_new_action_permission";
 *
 *  module.exports = {
 *      up: (queryInterface) => {
 *          const migrator = new PermissionMigrator(queryInterface);
 *          const data = [{
 *              permission,
 *              acl: {
 *                  "admin": true,
 *                  "manager": false,
 *              }
 *          }];
 *
 *          return migrator.up({ data }, { transactional: true }); // you can specify your own transaction OR provide option to create new one
 *      },
 *      down: (queryInterface) => {
 *          const migrator = new PermissionMigrator(queryInterface);
 *
 *          return migrator.down({ permissions: [permission] });
 *      },
 *  };
 */
export class PermissionMigrator {
    public constructor(protected queryInterface: QueryInterface) {
        if (!queryInterface) {
            throw new Error(`No query interface provided`);
        }
    }

    public async up(
        payload: PermissionMigrationUpPayload,
    ): Promise<void> {
        const { data, opts } = payload;
        const roles: RoleDto[] = await this.queryInterface.select(null, "role", { raw: true }) as RoleDto[];
        const transactionOptions = opts.trancation && opts
            || opts.transactional ? { transaction: await this.queryInterface.sequelize.transaction() } : {};

        const currentPermissionList: string[] = await this.getCurrentPermissionList();
        const permissionsToAdd: PermissionName[] = _.map(data, permissionData => permissionData.permission);
        const tableOptions = Permission.getTableName();
        const tableName = _.get(tableOptions, "tableName", tableOptions);

        await replaceEnum({
            tableName,
            queryInterface: this.queryInterface,
            columnName: "name",
            newValues: _.uniq([...currentPermissionList, ...permissionsToAdd]),
        });

        await Promise.map(data, async permissionData => {
            const roleNames: RoleName[] = _.keys(permissionData.acl) as RoleName[];
            // create permission
            const [permission] = await this.queryInterface.bulkInsert(
                "permission",
                [{ name: permissionData.permission, description: permissionData.description || "" }],
                { ...transactionOptions, returning: true },
            ) as RolePermissionDto[];


            const rolePermissionRecords: Partial<RolePermissionDto>[] = _.map(roleNames, (roleName: RoleName) => {
                const role: RoleDto = _.find(roles, { name: roleName });

                if (!role) {
                    transactionOptions.transaction && transactionOptions.transaction.rollback();
                    throw new Error(`Incorrect role name provided: ${roleName}`);
                }

                return { roleId: role.id, permissionId: permission.id, isEnabled: permissionData.acl[roleName] };
            });

            // create role-permission records
            await this.queryInterface.bulkInsert("role_permission", rolePermissionRecords, { ...transactionOptions });
        });

        transactionOptions.transaction && await transactionOptions.transaction.commit();
    }

    public async down(
        payload: PermissionMigrationDownPayload,
    ): Promise<void> {
        const { permissions, opts } = payload;
        const transactionOptions = opts.trancation && opts
            || opts.transactional ? { transaction: await this.queryInterface.sequelize.transaction() } : {};

        const currentPermissionList: string[] = await this.getCurrentPermissionList();
        await replaceEnum({
            queryInterface: this.queryInterface,
            tableName: "permission",
            columnName: "name",
            newValues: _.without(currentPermissionList, ...permissions),
        });
        // destroying permission record
        await this.queryInterface.bulkDelete("permission", { name: { [Op.in]: permissions } }, { ...transactionOptions });

        transactionOptions.transaction && await transactionOptions.transaction.commit();
    }

    private async getCurrentPermissionList(): Promise<string[]> {
        const data: { unnest: string }[] = await this.queryInterface.sequelize.query(
            `SELECT unnest(enum_range(NULL::enum_permission_name))`,
            { type: this.queryInterface.sequelize.QueryTypes.SELECT },
        );

        return data.map(d => d.unnest);
    }
}
