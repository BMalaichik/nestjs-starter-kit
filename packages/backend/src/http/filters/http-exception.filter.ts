import { HttpException, ExceptionFilter, Catch } from "@nestjs/common";

import { LoggerService } from "../../modules/logger";


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    public constructor(private readonly logger: LoggerService) {}

    public catch(exception: HttpException, response) {
        const status =  exception.getStatus();
        const message = exception.message.message || "Something went wrong";
        this.logger.error(exception.getResponse());

        response
            .status(status)
            .json({
                message,
            });
    }
}
