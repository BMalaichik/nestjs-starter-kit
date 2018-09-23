import { Model, Table, Column, DataType, UpdatedAt, CreatedAt } from "sequelize-typescript";


@Table({
    tableName: "contact",
})
export class Contact extends Model<Contact> {
    public static PUBLIC_ATTRIBUTES: (keyof Contact)[] = [
        "firstName",
        "lastName",
        "phone",
        "address",
        "title",
        "cell",
        "home",
        "ssn",
        "fax",
        "email",
        "dateOfBirth",
        "city",
        "state",
        "zip",
        "country",
    ];

    public id: number;

    @Column({
        type: DataType.STRING,
    })
    public phone: string;

    @Column({
        type: DataType.STRING,
    })
    public cell: string;

    @Column({
        type: DataType.STRING,
    })
    public home: string;

    @Column({
        type: DataType.STRING,
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
    public lastName: string;

    @Column({
        type: DataType.STRING,
    })
    public city: string;

    @Column({
        type: DataType.STRING,
    })
    public zip: string;

    @Column({
        type: DataType.STRING,
    })
    public state: string;

    @Column({
        type: DataType.STRING,
    })
    public ssn: string;

    @Column({
        type: DataType.STRING,
    })
    public country: string;

    @Column({
        type: DataType.STRING,
    })
    public address: string;

    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;
}
