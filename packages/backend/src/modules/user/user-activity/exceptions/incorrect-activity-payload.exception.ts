import * as _ from "lodash";
import { UnprocessableEntityException } from "@nestjs/common";

import { UserActivityDto } from "../dto";


export class IncorrectActivityPayloadException extends UnprocessableEntityException {
    constructor(activity: UserActivityDto) {
        super(`Activity #${activity.id} '${activity.action}' has incorrect payload.`);
    }
}
