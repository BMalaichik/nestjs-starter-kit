import { ExceptionFilter, Catch, HttpStatus } from "@nestjs/common";

import { InvalidPasswordException } from "../exceptions";


@Catch(InvalidPasswordException)
export class InvalidPasswordExceptionFilter implements ExceptionFilter {
    public catch(exception: InvalidPasswordException, response) {
        const status =  exception.getStatus();

        response
            .status(HttpStatus.FORBIDDEN)
            .json({
                message: exception.message.message,
            });
    }
}
