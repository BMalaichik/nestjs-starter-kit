import { BaseDto } from "../../base.dto";
import {UNIT_TYPE} from "../db/entities";

export class ProductDto extends BaseDto {
    id: number;
    name: string;
    description: string;
    available: number;
    unit_type: UNIT_TYPE;
    is_deleted: boolean;
    shop_id: number;
    category_id: number;
    native_price: number;
    sell_price: number;
    created_at: Date;
    updated_at: Date;
}
