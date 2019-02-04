import { Injectable, OnModuleInit, Inject } from "@nestjs/common";

import * as propertiesReader from "properties-reader";

import { SharedDiToken } from "../../../shared/shared.di";
import { UnresolvedActivityMessageException } from "../exceptions";
import { ValidatorService, EnumValueValidator } from "../../../shared/validator";
import { TemplateRenderer, DEFAULT_INTERPOLATION_DELIMITER } from "../../../shared/template-renderer";


export const ActivityMessageTemplate = Object.freeze({
    USER_CREATE         : "user_create",
});

@Injectable()
export class ActivityMessageMappingService implements OnModuleInit {
    private templatePath = `${__dirname}/../activity-messages.properties`;

    private cache: any;

    public constructor(
        @Inject(SharedDiToken.TEMPLATE_RENDERER) private readonly templateRenderer: TemplateRenderer,
    ) {

    }

    public async onModuleInit() {
        await this.load();
    }

    public async load() {
        this.cache = propertiesReader(this.templatePath);
    }

    public map(templateName: string, payload: any): string {
        ValidatorService.compose([
            new EnumValueValidator(ActivityMessageTemplate, "Template Name"),
        ])(templateName);

        const template = this.cache.get(templateName);

        if (!template) {
            throw new UnresolvedActivityMessageException(templateName);
        }

        return this.templateRenderer.render(template, payload, { interpolate: DEFAULT_INTERPOLATION_DELIMITER, failOnError: false });
    }
}
