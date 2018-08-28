import { ReflectMetadata } from "@nestjs/common";

import { UserRole } from "../../modules/db";


export const ROLES_METADATA_TOKEN = "roles";

export const Roles = (...args: UserRole[]) => ReflectMetadata(ROLES_METADATA_TOKEN, args);
