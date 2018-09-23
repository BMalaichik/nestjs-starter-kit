import * as _ from "lodash";

import { Validator, ValidationError } from "../types";


export class ValidNumberValidator implements Validator {
    public constructor(
        protected opts: {
            field: string,
            valueProperty?: string,
            message?: string,
            allowZero: boolean,
            allowNegative: boolean,
        },
    ) { }
    public validate(value: any): void {
        const valueToValidate = this.opts.valueProperty ? value[this.opts.valueProperty] : value;

        if (
            !_.isNumber(valueToValidate)
                || _.isNaN(value)
                || (!this.opts.allowZero && valueToValidate === 0)
                || (!this.opts.allowNegative && valueToValidate < 0)) {
            throw new ValidationError(this.opts.message || `${_.upperFirst(this.opts.field)} is not valid number`);
        }
    }
}
