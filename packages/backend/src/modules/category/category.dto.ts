import { BaseDto } from "../../base.dto";

export class CategoryDto extends BaseDto {
    id: number;
    name: string;
    description: string;
    unit_type: string;
    created_at: Date;
    updated_at: Date;
}
