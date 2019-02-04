import * as _ from "lodash";
import {
    Model,
    Table,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";

import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import { ForeignKeyOption } from "../utils";


@Table({
    indexes: [
        {
            unique: true,
            fields: ["roleId", "permissionId"],
        },
    ],
    tableName: "role_permission",
})
export class RolePermission extends Model<RolePermission> {

    public id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @ForeignKey(() => Role)
    roleId: number;

    @BelongsTo(() => Role, {
        onUpdate: ForeignKeyOption.CASCADE,
        onDelete: ForeignKeyOption.CASCADE,
    })
    role: Role;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @ForeignKey(() => Permission)
    permissionId: number;

    @BelongsTo(() => Permission, {
        onUpdate: ForeignKeyOption.CASCADE,
        onDelete: ForeignKeyOption.CASCADE,
    })
    permission: Permission;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isEnabled: boolean;
}
