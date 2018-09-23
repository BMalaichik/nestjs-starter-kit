import * as _ from "lodash";
import {
    Model,
    Table,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";

import { Contact } from "./contact.entity";


export enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
}

const roles: string[] = _.values(UserRole);

@Table({
    indexes: [
        {
            unique: true,
            fields: ["contactId"],
        },
    ],
    tableName: "user",
})
export class User extends Model<User> {

    public id: number;
    public static PUBLIC_ATTRIBUTES: (keyof User)[] = ["role", "isActive"];

    @Column({
        type: DataType.ENUM(roles),
        allowNull: false,
        validate: {
            isIn: [roles],
        },
    })
    role: UserRole;

    @Column({
        type: DataType.BOOLEAN,
    })
    isActive?: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    passwordHash: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    @ForeignKey(() => Contact)
    contactId: number;

    @BelongsTo(() => Contact)
    contact: Contact;

    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}
