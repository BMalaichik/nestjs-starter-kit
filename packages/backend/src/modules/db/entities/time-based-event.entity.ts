import * as _ from "lodash";
import {
    Model,
    Table,
    Column,
    DataType,
    UpdatedAt,
    CreatedAt,
} from "sequelize-typescript";


export enum TimeBasedEventStatus {
    STARTED = "started",
    COMPLETED = "completed",
    ERROR = "error",
}

const statuses: string[] = _.values(TimeBasedEventStatus);

@Table({
    tableName: "time_based_event",
})
export class TimeBasedEvent extends Model<TimeBasedEvent> {

    public static PUBLIC_ATTRIBUTES: (keyof TimeBasedEvent)[] = [
        "endDate",
        "status",
        "info",
    ];

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    startDate: Date;

    @Column({
        type: DataType.DATE,
    })
    endDate: Date;

    @Column({
        type: DataType.ENUM(statuses),
        allowNull: false,
        validate: {
            isIn: [statuses],
        },
    })
    status: TimeBasedEventStatus;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    code: string;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: {},
    })
    info: {
        error: any,
    };

    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}
