import * as _ from "lodash";
import {
    Model,
    Table,
    Column,
    DataType,
    ForeignKey,
    UpdatedAt,
    CreatedAt,
    BelongsTo,
} from "sequelize-typescript";

import { User } from "./user.entity";
import { ForeignKeyOption } from "../utils";


export enum FileType {
    BANK_STATEMENT = "bank_statement",
    STIP = "stipulation",
    APPLICATION_FORM = "application_form",
    MERCHANT_AGREEMENT = "merchant_agreement",
    SECURITY_AGREEMENT = "security_agreement",
    CONTRACT_INFO = "contract_info",
    COJ = "coj", // certificate_of_judjement
    ACH_AUTHORIZATION = "ach_authorize",
}

const types: string[] = _.values(FileType);

@Table({
    tableName: "file",
})
export class File extends Model<File> {

    public id: number;

    public static PUBLIC_ATTRIBUTES: (keyof File)[] = [
        "type",
        "name",
        "title",
    ];

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    uploadDate: Date;

    @Column({
        type: DataType.ENUM(types),
        allowNull: false,
        validate: {
            isIn: [types],
        },
    })
    type: FileType;

    @Column({  allowNull: false })
    title: string;

    @Column({ type: DataType.STRING })
    description: string;

    @Column({  allowNull: false })
    key: string;

    @Column({  allowNull: false })
    name: string;

    @Column({ allowNull: false, onDelete: ForeignKeyOption.CASCADE })
    @ForeignKey(() => User)
    uploadedByUserId: number;

    @Column({
        allowNull: false,
        type: DataType.JSONB,
    })
    context: {
        departmentId?: number;
        clientId?: number;
    };

    @BelongsTo(() => User)
    uploadedBy: User;

    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}
