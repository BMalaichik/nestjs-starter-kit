import { Component, Inject } from "@nestjs/common";

import * as _ from "lodash";
import { LoggerService, LoggerDiToken } from "../../logger";


export const DEFAULT_INTERPOLATION_DELIMITER = /{{([\s\S]+?)}}/g; // sample: {{ username }}

@Component()
export class TemplateRenderer {

    public constructor(@Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService) {}

    public render(template: string, data: any, options = { interpolate: DEFAULT_INTERPOLATION_DELIMITER, failOnError: true }) {
        try {
            return _.template(template, options)(data);
        } catch (err) {
            this.logger.error(`Error occurred rendering template`);
            console.error(err);

            if (options.failOnError) {
                throw err;
            }
        }
    }
}
