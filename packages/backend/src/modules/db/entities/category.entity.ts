import * as _ from "lodash";
import {
    Model,
    Table,
    Column,
    DataType,
    CreatedAt,
    UpdatedAt, Default, HasMany, AllowNull,
} from "sequelize-typescript";
import {Product, UNIT_TYPE} from "./product.entity";

export enum CATEGORY_TYPE {
    ACTIVE = "active",
    PASSIVE = "passive"
}

const unitTypes: string[] = _.values(UNIT_TYPE);
const categoryTypes: string[] = _.values(CATEGORY_TYPE);

@Table({
    tableName: "categories",
})
export class Category extends Model<Category> {

    public id: number;
    public static PUBLIC_ATTRIBUTES: (keyof Category)[] = [
        "name",
        "description",
        "is_deleted",
        "type",
        "unit_type"
    ];

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @Column(DataType.TEXT)
    description?: string;

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
    @Default(CATEGORY_TYPE.PASSIVE)
    @Column({
        type: DataType.ENUM(categoryTypes),
        validate: {
            isIn: [categoryTypes],
        }
    })
    type: string;

    @HasMany(() => Product)
    products: Product[];

    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;
}
