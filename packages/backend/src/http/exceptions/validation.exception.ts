import { BadRequestException } from "@nestjs/common";


export class ValidationException extends BadRequestException {
    public constructor(
        public readonly message: string,
    ) {
        super(message || `Validation Error`);
    }
}
