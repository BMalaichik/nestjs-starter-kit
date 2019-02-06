import { Inject, ForbiddenException, Injectable, BadRequestException, UnprocessableEntityException } from "@nestjs/common";

import * as _ from "lodash";
import { Op } from "sequelize";

import { BaseService } from "../../../../base.service";
import { JwtUserData } from "../../auth.interfaces";
import { PermissionDto } from "../dto";
import { LoggerDiToken, LoggerService } from "../../../logger";
import { RolePermissionDto, RoleDto, AclDto, AclDashboardDto } from "../../dto";
import { DbDiToken, Permission, RolePermission, PermissionName, RoleName, Role } from "../../../db";

@Injectable()
export class PermissionService extends BaseService {

    public constructor(
        @Inject(DbDiToken.PERMISSION_REPOSITORY) private readonly permissionRepository: typeof Permission,
        @Inject(DbDiToken.ROLE_REPOSITORY) private readonly roleRepository: typeof Role,
        @Inject(DbDiToken.ROLE_PERMISSION_REPOSITORY) private readonly rolePermissionRepository: typeof RolePermission,
        @Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService,
    ) {
        super();
    }

    public async isAllowed(user: JwtUserData, permissions: PermissionName[], throwOnError: boolean = false): Promise<boolean> {
        if (user.role.name === RoleName.SUPER_ADMIN) {
            return true;
        }

        const ids: number[] = _.map(
            await this.permissionRepository.findAll({ attributes: ["id"], where: { name: { [Op.in]: permissions } } }),
            p => p.get("id"),
        );
        const results: boolean[] = await Promise.mapSeries(ids, permissionId => {
            return this.exists<RolePermission>(this.rolePermissionRepository, { roleId: user.role.id, permissionId, isEnabled: true });
        });
        const allPermissionsGranted: boolean = _.every(results, x => !!x);

        if (!allPermissionsGranted) {
            const nonGrantedPermissionsIndexes: number[] = _.map(results, (res, index) => !!res ? -1 : index);
            const nonGrantedPermissions: PermissionName[] = _.map(nonGrantedPermissionsIndexes, i => permissions[i]);

            if (throwOnError) {
                this.logger.error(`Unauthorized access attempt: user #${user.id} has no permissions granted: ${nonGrantedPermissions}`);
                throw new ForbiddenException();
            }
        }

        return allPermissionsGranted;
    }

    public async updateRolePermission(data: RolePermissionDto): Promise<void> {
        const [updatedAmount]: [number, any] = await this.rolePermissionRepository.update(
            data,
            {
                where: _.pick(data, ["roleId", "permissionId"]),
                fields: ["isEnabled"],
            },
        );

        if (updatedAmount !== 1) {
            throw new BadRequestException(`Invalid payload`);
        }
    }

    public async getACLDashboard(): Promise<AclDashboardDto> {
        const permissionNames: string[] = _.values(PermissionName);
        const roles: RoleDto[] = _.map(
            // avoid exposing super-admin to the dashboard
            await this.roleRepository.findAll({ where: { name: { [Op.ne]: RoleName.SUPER_ADMIN } } }),
            role => role.toJSON(),
        );
        const permissions: PermissionDto[] = _.map(
            await this.permissionRepository.findAll(),
            p => p.toJSON(),
        );
        const rolePermissionsDtos: RolePermissionDto[] = _.map(
            await this.rolePermissionRepository.findAll({ include: [{ model: Role, as: "role" }, { model: Permission, as: "permission" }] }),
            rp => rp.toJSON(),
        );

        return {
            data: _.map(permissionNames, (permissionName: PermissionName) => {
                const permission: PermissionDto = _.find(permissions, { name: permissionName });

                if (!permission) {
                    throw new UnprocessableEntityException(`Permission mismatch: permission ${permissionName} has no record in database. Aborting`);
                }

                const acl = _.map(roles, (role: RoleDto) => {
                    const isEnabled: boolean = permission
                        && !!_.find(rolePermissionsDtos, { roleId: role.id, permissionId: permission.id, isEnabled: true });

                    return {
                        isEnabled,
                        role: role.name,
                        roleId: role.id,
                    };
                });

                return {
                    name: permissionName,
                    permissionId: permission && permission.id,
                    acl,
                };
            }),
            roles,
        };
    }

    public async getACL(user: { role: Partial<RoleDto> }): Promise<AclDto> {
        if (user.role.name === RoleName.SUPER_ADMIN) {
            const allpermission = _.values(PermissionName);

            return _.zipObject(allpermission, _.times(allpermission.length, x => true));
        }

        const userRolePermissions: RolePermissionDto[] = _.map(
            await this.rolePermissionRepository.findAll({ where: { roleId: user.role.id }, include: [ { model: Permission, as: "permission" } ] }),
            role => role.toJSON(),
        );

        return _.zipObject(
            _.map(userRolePermissions, p => p.permission.name),
            _.map(userRolePermissions, p => p.isEnabled),
        );
    }
}
