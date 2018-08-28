import { InternalServerErrorException } from "@nestjs/common";


export class PdfFileGenerationException extends InternalServerErrorException {
    constructor(message?: string) {
        super(message || `Pdf file generation failed`);
    }
}
