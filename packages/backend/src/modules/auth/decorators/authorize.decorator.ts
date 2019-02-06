import { ReflectMetadata } from "@nestjs/common";

import { PermissionWildcard } from "../guards";
import { PermissionName, RoleName, RoleWildcard } from "../../db";


export const AUTHORIZE_METADATA_TOKEN = "authorize";

export type AuthorizeMetadata = {
   [P in RoleName & RoleWildcard]?: PermissionName[] | PermissionWildcard;
};

/**
 *
 *  Enables Role&Permission-Based authentication
 *  SUPER_ADMIN role has full role & authentication guard ingnores super-admin related metadata.
 *  If role is not mentioned in metadata, it means that access is completely forbidden for it.
 *  Usage samples:
 *  ```
 *   @Authorize({
 *      [RoleName.ADMIN]: [PermissionName.PAYMENT_ADD]
 *   })
 *  ```
 *    Access would be granted only* to admin users, if role has enabled payment-add permission
 *  ```
 *   @Authorize({
 *      [RoleWildcard]: [PermissionName.PAYMENT_ADD]
 *   })
 *  ```
 *    Access would be granted to any-role users, if their role has enabled payment-add permission
 *  ```
 *   @Authorize({
 *      [RoleName.VIEWER]: false,
 *   })
 *  ```
 *    Is Equivalent to
 *  ```
 *   @Authorize()
 *  ```
 *    Access would be granted only to super-admin.
 *
 *  ```
 *   @Authorize({
 *      [RoleName.ADMIN]: PermissionWildcard
 *   })
 *  ```
 *    Access would be granted to admin users (no permissions checks performed)
 *
 *    * - by only we don't metnion super-admin role since it has full-privileged access to the system.
 */
export const Authorize = (metadata: AuthorizeMetadata = {}) => ReflectMetadata(AUTHORIZE_METADATA_TOKEN, metadata);
