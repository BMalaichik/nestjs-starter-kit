import { BaseDto } from "../../../base.dto";
import { RoleDto } from "./role.dto";
import { PermissionDto } from "./permission.dto";

export class RolePermissionDto extends BaseDto {
    public id: number;
    public roleId: number;
    public role?: RoleDto;
    public permissionId: number;
    public permission?: PermissionDto;
    public isEnabled: boolean;
}
