import * as _ from "lodash";
import { BadRequestException } from "@nestjs/common";


export class InvalidArgumentException extends BadRequestException {
    constructor(argument: string, value?: any, msg?: string) {
        const argumentValue: string = value && _.isObject(value) && JSON.stringify(value) || value && value.toString() || "";
        super(msg || `Invalid argument provided. argument: ${argument}, value: ${argumentValue}`);
    }
}
