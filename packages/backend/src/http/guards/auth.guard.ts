// import * as _ from "lodash";
import { Reflector } from "@nestjs/core";
// import { Observable } from "rxjs/Observable";
import { CanActivate, Guard, ExecutionContext } from "@nestjs/common";

// import { UserRole } from "../../modules/db";
// import { ROLES_METADATA_TOKEN, PUBLIC_METADATA_TOKEN } from "../decorators";


@Guard()
export class AuthorizeGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    public canActivate() {
        return true;
    }
    /*public canActivate(request: any, context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get<boolean>(PUBLIC_METADATA_TOKEN, context.handler);

        if (isPublic) {
            return true;
        }

        if (!isPublic && !request.user) {
            return false;
        }

        const requestedRoles: UserRole[] = this.reflector.get<UserRole[]>(ROLES_METADATA_TOKEN, context.handler);
        const userAvailableRoles: UserRole[] = _.get(request, "user.roles", []);

        if (userAvailableRoles.length === 0) {
            console.error(`User #${request.user.id} has no roles defined`);

            return false;
        }

        return _.isEmpty(requestedRoles) || _.some(requestedRoles, requestedRole => _.includes(userAvailableRoles, requestedRole));
    }*/
}


