import { ForbiddenException } from "@nestjs/common";


export class CurrentUserNotDefinedException extends ForbiddenException {
    constructor() {
        super(`Current used not defined`);
    }
}
