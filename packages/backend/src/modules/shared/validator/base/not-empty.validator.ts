import * as _ from "lodash";

import { Validator, ValidationError } from "../types";


export class NotEmptyValidator implements Validator {
    public constructor(
        protected field: string,
        protected valueProperty?: string,
        protected message?: string,
    ) {}
    public validate(value: any): void {
        const valueToValidate = this.valueProperty ? value[this.valueProperty] : value;

        if (_.isEmpty(valueToValidate)) {
            throw new ValidationError(this.message || `${_.upperFirst(this.field)} must be set`);
        }
    }
}
