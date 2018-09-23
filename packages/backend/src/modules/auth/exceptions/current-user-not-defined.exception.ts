import { ForbiddenException } from "@nestjs/common";


export class CurrentUserNotDefinedException extends ForbiddenException {
    constructor() {
        super(`Current user not defined`);
    }
}
