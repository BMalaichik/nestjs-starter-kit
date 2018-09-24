import * as _ from "lodash";
import * as Bluebird from "bluebird";

import { ValidationException } from "../../../http/exceptions";
import { ValidationOptions, ValidationResult, ValidationCb, Validator, ValidationError, AsyncValidator } from "./types";


/**
 *      Generic utility for wrapping validators.
 *      usage sample:
 *
 *      const testValue = { a: null, b: [] };
 *      const res = await ValidatorService.compose(
 *          [
 *              new NotNilValidator("A", "a"),
 *              // new NotEmptyValidator("B", "b"),
 *          ],
 *          [
 *              new SampleAsynclValidator("async-A-1", "a"),
 *              new SampleAsynclValidator("async-A-2", "c"),
 *          ],
 *          { failOnError: false }
 *      )(testValue);
 *
 */
export class ValidatorService {

    public static compose(
        validators: Validator[] = [],
        asyncValidators: AsyncValidator[] = [],
        opts: ValidationOptions = { failOnError: true },
    ): ValidationCb {
        const errors: ValidationError[] = [];

        return (value: any) => {
            _.each(validators, (validator: Validator) => {
                ValidatorService.validateValidator(validator);
                try {
                    validator.validate(value);
                } catch (err) {
                    ValidatorService.handleError(errors, err, validator);
                }
            });

            if (!asyncValidators.length) {
                return ValidatorService.handleResponse(errors, opts);
            }

            return Bluebird
                .map(
                    asyncValidators,
                    async (validator: AsyncValidator) => {
                        ValidatorService.validateValidator(validator);
                        try {
                            await validator.validate(value);
                        } catch (err) {
                            ValidatorService.handleError(errors, err, validator);
                        }
                    },
                    { concurrency: 10 },
            )
                .then(() => {
                    return ValidatorService.handleResponse(errors, opts) as any;
                });
        };
    }

    private static handleError(errors: ValidationError[], err: any, validator: Validator) {
        if (err instanceof ValidationError) {
            errors.push(err);
        } else {
            const msg: string = `${_.get(validator, "constructor.name")} validation failed. Error: ${err}`;
            errors.push(new ValidationError(msg));
        }
    }

    private static handleResponse(errors: ValidationError[], opts: ValidationOptions): ValidationResult {
        if (!!errors.length) {
            if (opts.failOnError) {
                throw new ValidationException(_.map(errors, e => e.message).join(". "));
            }

            return errors;
        }
    }

    /**
     *  We need more validation
     */
    private static validateValidator(v: Validator | AsyncValidator): void {
        if (!(v.validate instanceof Function)) {
            throw new Error(`Invalid Validator provided.`);
        }
    }
}
