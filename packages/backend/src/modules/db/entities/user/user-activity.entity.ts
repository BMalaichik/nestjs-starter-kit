import * as _ from "lodash";
import { Model, Table, Column, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";

import { User } from "./user.entity";
import { ActivityAction } from "./activity-action";
import { ForeignKeyOption } from "../../utils";


const actions = _.values(ActivityAction);

@Table({
    tableName: "user_activity",
})
export class UserActivity extends Model<UserActivity> {
    public static PUBLIC_ATTRIBUTES: (keyof UserActivity)[] = [
    ];

    public id: number;

    @Column({
        type: DataType.DATE,
    })
    public date: Date;

    @Column({
        type: DataType.ENUM(actions),
        validate: {
            isIn: [actions],
        },
        allowNull: false,
    })
    public action: ActivityAction;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public author: string;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    public payload: any;

    @Column({ allowNull: true, onDelete: ForeignKeyOption.SET_NULL })
    @ForeignKey(() => User)
    public performedByUserId: number;

    @BelongsTo(() => User)
    public performedBy: User;
}
