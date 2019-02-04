import { RoleName } from "../../db";
import { BaseDto } from "../../../base.dto";


export class RoleDto extends BaseDto {
    id: number;
    name: RoleName;
    description: string;
}
