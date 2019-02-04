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
    HasMany,
} from "sequelize-typescript";

import { Role } from "./role.entity";
import { Contact } from "./contact.entity";


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
    public static PUBLIC_ATTRIBUTES: (keyof User)[] = ["roleId", "isActive"];

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    roleId: number;

    @BelongsTo(() => Role)
    role: Role;

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
