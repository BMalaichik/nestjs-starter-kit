import { PipeTransform, Injectable } from "@nestjs/common";

import * as _ from "lodash";
import { plainToClass, ClassTransformOptions } from "class-transformer";
import { validate, ValidationError } from "class-validator";

import { ValidationException } from "../exceptions";


@Injectable()
export class SchemaValidationPipe  implements PipeTransform {
    public async transform(value: any, metadata: any) {
        const { metatype } = metadata;

        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const transformed = plainToClass(metatype, value);
        const errors: ValidationError[] = await validate(transformed);

        if (!!errors.length) {
            throw new ValidationException(this.formatErrorInfo(errors));
        }

        return value;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];

        return !types.find((type) => metatype === type);
    }

    private formatErrorInfo(errors: ValidationError[]): string {
        return _.map(errors, e => {
            return _.keys(e.constraints).map(constraint => `${constraint}: ${e.constraints[constraint]}`).join(", ");
        }).join(";");
    }
}
