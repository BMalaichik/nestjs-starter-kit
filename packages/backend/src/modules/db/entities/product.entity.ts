import * as _ from "lodash";
import {
    Model,
    Table,
    Column,
    DataType,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    BelongsTo,
    Default, HasOne, AllowNull
} from "sequelize-typescript";
import {Category} from "./category.entity";
import {Shop} from "./shop.entity";

export enum UNIT_TYPE {
    UNIT = "unit",
    G = "g",
    KG = "kg",
    ML = "ml",
    L = "l"
}
const unitTypes = _.values(UNIT_TYPE);

@Table({
    tableName: "products",
})
export class Product extends Model<Product> {

    public id: number;
    public static PUBLIC_ATTRIBUTES: (keyof Product)[] = [
        "name",
        "description",
        "available",
        "unit_type",
        "is_deleted",
        // "shop_id",
        "category_id",
        "native_price",
        "sell_price"
    ];

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @Column(DataType.TEXT)
    description?: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    available: number;

    @AllowNull(false)
    @Column({
        type: DataType.ENUM(unitTypes),
        validate: {
            isIn: [unitTypes],
        }
    })
    unit_type: UNIT_TYPE;

    @Default(false)
    @Column(DataType.BOOLEAN)
    is_deleted: boolean;

    @AllowNull(false)
    @Column(DataType.FLOAT)
    native_price: number;

    @Column(DataType.FLOAT)
    sell_price?: number;

    @AllowNull(false)
    @ForeignKey(() => Category)
    @Column(DataType.INTEGER)
    category_id: number;
    @BelongsTo(() => Category)
    category: Category;

    @ForeignKey(() => Shop)
    @Column(DataType.INTEGER)
    shop_id?: number;

    @BelongsTo(() => Shop)
    shop: Shop;

    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;
}
