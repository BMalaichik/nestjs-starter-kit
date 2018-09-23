import { ExceptionFilter, Catch, HttpStatus, ArgumentsHost } from "@nestjs/common";

import { InvalidPasswordException } from "../exceptions";


@Catch(InvalidPasswordException)
export class InvalidPasswordExceptionFilter implements ExceptionFilter {
    public catch(exception: InvalidPasswordException, host: ArgumentsHost) {
        host.switchToHttp().getResponse()
            .status(HttpStatus.FORBIDDEN)
            .json({
                message: exception.message.message,
            });
    }
}
