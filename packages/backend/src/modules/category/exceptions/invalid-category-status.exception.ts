import * as _ from "lodash";
import { BadRequestException } from "@nestjs/common";


export class InvalidCategoryStatusException extends BadRequestException {
    constructor() {
        super(`Invalid user status provided`);
    }
}
