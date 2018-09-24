import { ExceptionFilter, Catch, ArgumentsHost, Inject } from "@nestjs/common";

import { ValidationException } from "../exceptions";
import { ConfigDiToken, Config, Env } from "../../modules/config";
import { LoggerService, LoggerDiToken } from "../../modules/logger";


@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
    public constructor(
        @Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService,
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
    ) { }

    public catch(exception: ValidationException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();

        this.logger.error(exception.message);

        if (this.config.env !== Env.PRODUCTION) {
            console.error(exception.message); // pino prettifier ignores error stack trace
        }

        response
            .status(exception.getStatus())
            .json({
                message: exception.message,
            });

    }
}
