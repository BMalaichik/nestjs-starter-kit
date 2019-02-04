import * as _ from "lodash";
import { InternalServerErrorException } from "@nestjs/common";


export class UnresolvedActivityMessageException extends InternalServerErrorException {
    constructor(templateName: string) {
        super(`Non resolved activity message template '${templateName}'`);
    }
}
