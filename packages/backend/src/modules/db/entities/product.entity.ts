import * as _ from "lodash";
import {
    Model,
    Table,
    Column,
    DataType,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";


export enum UNIT_TYPE {
    UNIT = "unit",
    G = "g",
    KG = "kg",
    ML = "ml",
    L = "l"
}

export enum PRODUCT_TYPE {
    INGREDIENT = "ingredient",
    SELL_PRODUCT = "sell_product"
}

const unitTypes = _.values(UNIT_TYPE);
const productTypes = _.values(PRODUCT_TYPE);

@Table({
    indexes: [
        {
            unique: true,
            fields: ["id"],
        },
    ],
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
        "shop_id",
        "type",
        "native_price",
        "sell_price"
    ];

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
    })
    description?: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    available: number;

    @Column({
        type: DataType.ENUM(unitTypes),
        validate: {
            isIn: [unitTypes],
        },
        allowNull: false
    })
    unit_type: UNIT_TYPE;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: () => false
    })
    is_deleted: boolean;

    @Column({
        type: DataType.INTEGER
    })
    shop_id?: number;

    @Column({
        type: DataType.ENUM(productTypes),
        validate: {
            isIn: [productTypes],
        },
        defaultValue: PRODUCT_TYPE.INGREDIENT,
        allowNull: false
    })
    type: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    native_price: number;

    @Column({
        type: DataType.FLOAT
    })
    sell_price?: number;

    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;
}
