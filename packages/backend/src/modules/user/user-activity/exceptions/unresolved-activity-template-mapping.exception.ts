import * as _ from "lodash";
import { InternalServerErrorException } from "@nestjs/common";

import { ActivityAction } from "../../../db";


export class UnresolvedActivityTemplateMappingException extends InternalServerErrorException {
    constructor(action: ActivityAction) {
        super(`Non resolved activity template for action '${action}'`);
    }
}
