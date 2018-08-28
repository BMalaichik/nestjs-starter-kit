import { Component, Inject } from "@nestjs/common";

import * as fs from "fs";
import * as pdfGenerator from "html-pdf";
import { promisify } from "bluebird";

import { BaseService } from "../../../base.service";
import { SharedDiToken } from "../../shared/shared.di";
import { TemplateRenderer } from "../../shared/template-renderer";
import { PdfFileGenerationException } from "../exceptions/pdf-file-generation.exception";
import { LoggerDiToken, LoggerService } from "../../logger";
import { PdfFileTemplateNotResolvedException } from "../exceptions";
import { FileService, FileDiToken, FileDto, FileParams } from "..";


@Component()
export class PdfFileGeneratorService extends BaseService {

    public constructor(
        @Inject(FileDiToken.FILE_SERVICE) private readonly fileService: FileService,
        @Inject(SharedDiToken.TEMPLATE_RENDERER) private readonly renderer: TemplateRenderer,
        @Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService,
    ) {
        super();
    }

    public async generate({ templateName, data, params }: { templateName: string, data: any, params: FileParams }): Promise<FileDto> {
        try {
            const template: string = await this.getTemplate(templateName);
            const renderedTemplate = this.renderer.render(template, data);
            const context = pdfGenerator.create(renderedTemplate, { format: "A4", type: "pdf" });
            const readStream: fs.ReadStream = await promisify(context.toStream, { context })();
            const file: FileDto = await this.fileService.multipartUpload(readStream, params);

            return file;
        } catch (err) {
            this.logger.error(err);

            throw new PdfFileGenerationException();
        }
    }


    private async getTemplate(name: string): Promise<string> {
        try {
            return (promisify(fs.readFile, { multiArgs: true }) as any)(`${__dirname}/../templates/${name}.html`, "utf-8");
        } catch (err) {
            this.logger.error(err);

            throw new PdfFileTemplateNotResolvedException(name);
        }
    }
}
