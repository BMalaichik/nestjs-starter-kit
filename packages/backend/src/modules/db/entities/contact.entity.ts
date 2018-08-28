import * as _ from "lodash";
import { Model, Table, Column, DataType, UpdatedAt, CreatedAt } from "sequelize-typescript";


@Table({
    tableName: "contact",
})
export class Contact extends Model<Contact> {

    public id: number;

    @Column({
        type: DataType.STRING(20),
    })
    public phone: string;

    @Column({
        type: DataType.STRING(20),
    })
    public cell: string;

    @Column({
        type: DataType.STRING(100),
    })
    public home: string;

    @Column({
        type: DataType.STRING(20),
    })
    public fax: string;

    @Column({
        type: DataType.STRING(100),
        validate: {
            isEmail: true,
        },
        unique: true,
    })
    public email: string;

    @Column({
        type: DataType.STRING(100),
    })
    public firstName: string;

    @Column({
        type: DataType.DATEONLY,
    })
    public dateOfBirth: string;

    @Column({
        type: DataType.STRING(100),
    })
    public title: string;

    @Column({
        type: DataType.STRING(100),
    })
    lastName: string;

    @Column({
        type: DataType.STRING(100),
    })
    public city: string;

    @Column({
        type: DataType.STRING(20),
    })
    public zip: string;

    @Column({
        type: DataType.STRING(100),
    })
    public state: string;

    @Column({
        type: DataType.STRING(100),
    })
    public ssn: string;

    @Column({
        type: DataType.CHAR(3),
    })
    public country: string;

    @Column({
        type: DataType.STRING(100),
    })
    public address: string;

    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}
