import { InternalServerErrorException } from "@nestjs/common";


export class PdfFileTemplateNotResolvedException extends InternalServerErrorException {
    constructor(name: string) {
        super(`File template ${name} not resolved`);
    }
}
