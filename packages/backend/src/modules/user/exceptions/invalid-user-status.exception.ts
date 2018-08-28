import * as _ from "lodash";
import { BadRequestException } from "@nestjs/common";


export class InvalidUserStatusException extends BadRequestException {
    constructor() {
        super(`Invalid user status provided`);
    }
}
