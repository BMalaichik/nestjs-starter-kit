import * as _ from "lodash";

import { Validator, ValidationError } from "../types";


export class EnumValueValidator<T> implements Validator {
    public constructor(
        protected enumObject: T,
        protected field: string,
        protected valueProperty?: string,
        protected message?: string,
    ) {}
    public validate(value: any): void {
        const valueToValidate = this.valueProperty ? _.get(value, this.valueProperty) : value;

        if (!_.includes(_.values(this.enumObject), valueToValidate )) {
            throw new ValidationError(this.message || `${_.upperFirst(this.field)} must be relevant enumeration item`);
        }
    }
}
