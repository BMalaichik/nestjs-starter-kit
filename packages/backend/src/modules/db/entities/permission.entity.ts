import * as _ from "lodash";
import {
    Model,
    Table,
    Column,
    DataType,
} from "sequelize-typescript";


export enum PermissionName {
    USER_MANAGEMENT_VIEW        = "user_management_view",
    USER_MANAGEMENT_ADD         = "user_management_add",
    USER_MANAGEMENT_UPDATE      = "user_management_update",
    USER_MANAGEMENT_DELETE      = "user_management_delete",
}

const permissions: string[] = _.values(PermissionName);

@Table({
    tableName: "permission",
})
export class Permission extends Model<Permission> {

    public id: number;

    @Column({
        type: DataType.ENUM(permissions),
        allowNull: false,
        validate: {
            isIn: [permissions],
        },
    })
    name: PermissionName;

    @Column({
        type: DataType.STRING,
    })
    description: string;
}
