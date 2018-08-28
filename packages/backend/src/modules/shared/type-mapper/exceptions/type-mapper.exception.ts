import { InternalServerErrorException } from "@nestjs/common";


export class TypeMapperException extends InternalServerErrorException {
    constructor(msg: string) {
        super(msg);
      }
}
