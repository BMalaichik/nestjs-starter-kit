import {
    Model,
    Table,
    Column,
    DataType,
    CreatedAt,
    UpdatedAt,
    AllowNull, Default, HasMany,
} from "sequelize-typescript";
import {Product} from "./product.entity";

@Table({
    tableName: "shops",
})
export class Shop extends Model<Shop> {

    public id: number;
    public static PUBLIC_ATTRIBUTES: (keyof Shop)[] = [
        "name",
        "description",
        "is_deleted",
        "working_days",
        "open_at",
        "close_at",
        "rent_price"
    ];

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @Column(DataType.TEXT)
    description?: string;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    is_deleted: boolean;

    @Column(DataType.SMALLINT) // bitmap
    working_days: number;

    @Column(DataType.TIME)
    open_at: string;

    @Column(DataType.TIME)
    close_at: string;

    @Column(DataType.INTEGER)
    rent_price: number;

    // @HasMany(() => Product)
    // products: Product[];

    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;
}
