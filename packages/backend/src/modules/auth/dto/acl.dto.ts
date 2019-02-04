import { PermissionName } from "../../db";

export type AclDto = {
    [P in PermissionName]? : boolean;
};
