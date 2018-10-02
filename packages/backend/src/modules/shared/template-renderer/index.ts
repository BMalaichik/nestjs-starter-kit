import { Injectable, Inject } from "@nestjs/common";

import * as _ from "lodash";
import { LoggerService, LoggerDiToken } from "../../logger";


export const DEFAULT_INTERPOLATION_DELIMITER = /{{([\s\S]+?)}}/g; // sample: {{ username }}

/**
 *  Abstraction incapsulating template rendering logic. Uses preconfigured {@link https://lodash.com/docs/4.17.10#template|_.template()}.
 *  Preconfigured interpolation delimiter - {{ bindProperty }}
 *  @example
 *  const template = `Hi, {{ username }}!`;
 *  const result = this.templateRenderer.render(template, { username: 'John' });
 *  result ---> `Hi, John`
 */
@Injectable()
export class TemplateRenderer {

    public constructor(@Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService) {}

    public render(template: string, data: any, options = { interpolate: DEFAULT_INTERPOLATION_DELIMITER, failOnError: true }) {
        try {
            return _.template(template, options)(data);
        } catch (err) {
            this.logger.error(`Error occurred rendering template: ${err}`);
            console.error(err);

            if (options.failOnError) {
                throw err;
            }
        }
    }
}
