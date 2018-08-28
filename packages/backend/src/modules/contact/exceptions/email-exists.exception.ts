import { BadRequestException } from "@nestjs/common";


export class EmailExistsException extends BadRequestException {
    constructor(msg?: string) {
        super(msg  || `Email already exists`);
    }
}
