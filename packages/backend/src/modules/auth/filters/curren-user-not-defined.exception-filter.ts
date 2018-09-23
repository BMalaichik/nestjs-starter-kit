import { ExceptionFilter, Catch, HttpStatus, ArgumentsHost } from "@nestjs/common";

import { CurrentUserNotDefinedException } from "../exceptions";


@Catch(CurrentUserNotDefinedException)
export class CurrentUserNotDefinedExceptionFilter implements ExceptionFilter {
    public catch(exception: CurrentUserNotDefinedException, host: ArgumentsHost) {
        host.switchToHttp().getResponse()
            .status(HttpStatus.UNPROCESSABLE_ENTITY)
            .json({
                message: `Somethinw went wrong. Please, contact administrator`,
            });
    }
}
