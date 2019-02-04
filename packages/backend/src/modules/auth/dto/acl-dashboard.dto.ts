import { RoleDto } from "./role.dto";
import { PermissionName, RoleName } from "../../db";


export interface AclDashboardDto {
    data: { name: PermissionName; acl: { role: RoleName; isEnabled: boolean; }[] }[];
    roles: RoleDto[];
}
