import { ExceptionFilter, Catch, HttpStatus } from "@nestjs/common";

import { CurrentUserNotDefinedException } from "../exceptions";


@Catch(CurrentUserNotDefinedException)
export class CurrentUserNotDefinedExceptionFilter implements ExceptionFilter {
    public catch(exception: CurrentUserNotDefinedException, response) {
        const status =  exception.getStatus();

        response
            .status(HttpStatus.UNPROCESSABLE_ENTITY)
            .json({
                message: `Somethinw went wrong. Please, contact administrator`,
            });
    }
}
