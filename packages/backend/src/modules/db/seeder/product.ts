import {PRODUCT_TYPE, UNIT_TYPE} from "../entities";

export const products = [
    {
        name: "Ingredient 1",
        description: "lorem ipsum",
        available: 10,
        unit_type: UNIT_TYPE.L,
        is_deleted: false,
        shop_id: 1,
        type: PRODUCT_TYPE.INGREDIENT,
        native_price: 100
    }, {
        name: "Ingredient 2",
        description: "lorem ipsum",
        available: 100,
        unit_type: UNIT_TYPE.KG,
        is_deleted: false,
        type: PRODUCT_TYPE.INGREDIENT,
        native_price: 100
    }, {
        name: "Product 1",
        description: "lorem ipsum",
        available: 10,
        unit_type: UNIT_TYPE.UNIT,
        is_deleted: false,
        type: PRODUCT_TYPE.SELL_PRODUCT,
        native_price: 100,
        sell_price: 200
    },
];
