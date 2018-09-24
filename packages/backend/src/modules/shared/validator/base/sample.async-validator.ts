import * as _ from "lodash";

import { AsyncValidator, ValidationError } from "../types";


export class SampleAsynclValidator implements AsyncValidator {
    public constructor(
        protected field: string,
        protected valueProperty?: string,
        protected message?: string,
    ) {}
    public async validate(value: any): Promise<void> {
        const valueToValidate = this.valueProperty ? _.get(value, this.valueProperty) : value;

        if (_.isNil(valueToValidate)) {
            throw new ValidationError(this.message || `${_.upperFirst(this.field)} must be set`);
        }
    }
}
