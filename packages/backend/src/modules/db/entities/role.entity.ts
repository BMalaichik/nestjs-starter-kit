import * as _ from "lodash";
import {
    Model,
    Table,
    Column,
    DataType,
} from "sequelize-typescript";


export enum RoleName {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    MANAGER = "manager",
}

export type RoleWildcard = "*";
export const RoleWildcard = "*";

const roles: string[] = _.values(RoleName);

@Table({
    tableName: "role",
})
export class Role extends Model<Role> {

    public id: number;

    @Column({
        type: DataType.ENUM(roles),
        allowNull: false,
        unique: true,
        validate: {
            isIn: [roles],
        },
    })
    name: RoleName;

    @Column({
        type: DataType.STRING,
    })
    description: string;
}
