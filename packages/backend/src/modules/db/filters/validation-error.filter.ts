import { ExceptionFilter, Catch } from "@nestjs/common";

import * as _ from "lodash";
import { ValidationError } from "sequelize";


@Catch(ValidationError)
export class ValidationFilter implements ExceptionFilter {
    public catch(exception: ValidationError, response) {
        let error = _.map(exception.errors, exceptionError => `${exceptionError.type}: ${exceptionError.message}`) ;
        console.log(`Unhandled sequelize validation error: `, error.join("\n"));

        if (process.env.NODE_ENV !== "development") {
            error = ["Unhandled validation error occurred"];
        }

        response
            .status(400)
            .json({
                message: error,
            });
    }
}
