import { NotFoundException } from "@nestjs/common";

import * as _ from "lodash";


export class EntityNotFoundException extends NotFoundException {
    constructor(entity: string, id?: number, message?: string) {
        super(message || `${_.upperFirst(entity)} with id #${id || "?"} not found`);
    }
}
