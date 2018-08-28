import * as _ from "lodash";
import { ForbiddenException, HttpStatus, Catch } from "@nestjs/common";


export class InvalidPasswordException extends ForbiddenException {
    constructor() {
        super(`Invalid password provided`);
    }
}
