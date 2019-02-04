import * as _ from "lodash";
import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, Injectable, Inject, ForbiddenException, UnauthorizedException } from "@nestjs/common";

import { RoleDto } from "../dto";
import { PermissionName, RoleName, RoleWildcard } from "../../db";
import { PermissionDiToken, PermissionService } from "../permission";
import { PUBLIC_METADATA_TOKEN, AuthorizeMetadata, AUTHORIZE_METADATA_TOKEN } from "../decorators";


export type PermissionWildcard = "*";
export const PermissionWildcard = "*";

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @Inject(PermissionDiToken.PERMISSION_SERVICE) private readonly permissionService: PermissionService,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const isPublic = this.reflector.get<boolean>(PUBLIC_METADATA_TOKEN, handler);

        if (isPublic) {
            return true;
        }

        if (!isPublic && !request.user) {
            throw new UnauthorizedException();
        }

        const methodMetadata: AuthorizeMetadata = this.reflector.get<AuthorizeMetadata>(AUTHORIZE_METADATA_TOKEN, handler);
        const controllerMetadata: AuthorizeMetadata = this.reflector.get<AuthorizeMetadata>(AUTHORIZE_METADATA_TOKEN, context.getClass());
        const metadata: AuthorizeMetadata = methodMetadata || controllerMetadata; // falling back to controller-level metadata

        if (!metadata) {
            return !!request.user; // no metadata defined. We assume that user must be be just authenticated
        }

        const userRole: Partial<RoleDto> = _.get(request, "user.role");

        if (!userRole) {
            throw new ForbiddenException(`Incorrect user data payload: no user role resolved`);
        }

        if (userRole.name === RoleName.SUPER_ADMIN) {
            return true; // full access granted
        }

        const requiredPermissions: PermissionName [] | PermissionWildcard = metadata[RoleWildcard] || metadata[userRole.name];

        if (!requiredPermissions) {
            return false; // no metadata entry found for user role
        }

        if (requiredPermissions === PermissionWildcard) {
            return true; // no permissions required for particular role
        }

        return this.permissionService.isAllowed(request.user, requiredPermissions);
    }
}


