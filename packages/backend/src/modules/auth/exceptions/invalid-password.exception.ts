import { ForbiddenException } from "@nestjs/common";


export class InvalidPasswordException extends ForbiddenException {
    constructor() {
        super(`Username-Password combination is incorrect`);
    }
}
