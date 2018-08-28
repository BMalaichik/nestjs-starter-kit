import * as Bluebird from "bluebird";


export interface ValidationOptions {
    failOnError?: boolean;
}

export type ValidationResult = Bluebird<void> | void | ValidationError[] | Bluebird<ValidationError[]>;
export type ValidationCb = (value: any) => ValidationResult;

export class ValidationError extends Error {
    public constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export interface Validator {
    validate(value: any): void;
}

export interface AsyncValidator {
    validate(value: any): Promise<void>;
}
