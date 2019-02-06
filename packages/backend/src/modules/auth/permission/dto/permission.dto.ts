import { BaseDto } from "../../../../base.dto";
import { PermissionName } from "../../../db";


export class PermissionDto extends BaseDto {
    id: number;
    name: PermissionName;
    description: string;
}
