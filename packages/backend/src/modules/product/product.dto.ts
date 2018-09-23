import { BaseDto } from "../../base.dto";
import {PRODUCT_TYPE, UNIT_TYPE} from "../db/entities/product.entity";

export class ProductDto extends BaseDto {
    id: number;
    name: string;
    description: string;
    available: number;
    unit_type: UNIT_TYPE;
    is_deleted: boolean;
    shop_id: number;
    type: PRODUCT_TYPE;
    native_price: number;
    sell_price: number;
    created_at: Date;
    updated_at: Date;
}
