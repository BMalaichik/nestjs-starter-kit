import { BadRequestException } from "@nestjs/common";


export class UserRegistrationException extends BadRequestException {
    constructor(msg?: string) {
        super(msg || `User registration failed`);
    }
}
