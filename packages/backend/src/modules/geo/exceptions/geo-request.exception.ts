import * as _ from "lodash";
import { BadRequestException } from "@nestjs/common";


export class GeoRequestException extends BadRequestException {
    constructor(msg?: string) {
        super(msg  || `Geo request failed`);
    }
}
