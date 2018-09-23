import * as _ from "lodash";
import { BadRequestException } from "@nestjs/common";


export class InvalidProductStatusException extends BadRequestException {
    constructor() {
        super(`Invalid user status provided`);
    }
}
