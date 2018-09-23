import { ExceptionFilter, Catch, InternalServerErrorException, ArgumentsHost, HttpException } from "@nestjs/common";

import { LoggerService } from "../../modules/logger";


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    public constructor(private readonly logger: LoggerService) { }

    public catch(error: Error, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();

        this.logger.error(error);

        if (error instanceof HttpException) {
            this.handleHttpException(error as HttpException, response);
        } else {
            this.handleUncaughtError(error, response);
        }
    }

    private handleHttpException(exception: HttpException, response) {
        const status = exception.getStatus();
        const message = exception.message.message || "Something went wrong";

        this.logger.error(exception.getResponse()); // logging in cloudwatch-friendly way

        if (process.env.NODE_ENV !== "production") {
            console.error(exception.message); // pino prettifier ignores error stack trace
        }

        response
            .status(status)
            .json({ message });
    }

    private handleUncaughtError(error: Error, response) {
        this.logger.error(`Unhandled exception occurred`);

        if (process.env.NODE_ENV !== "production") {
            console.error(error); // pino prettifier ignores error stack trace
        } else {
            // logging in cloudwatch-friendly way: wrapping with 500 Exception ot properly log server fault
            // and trigger cloudwatch alarm
            this.logger.error((new InternalServerErrorException(error.message)).getResponse());
        }

        response
            .status(500)
            .json({
                message: "Something went wrong",
            });
    }
}
