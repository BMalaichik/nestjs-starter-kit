import { ExceptionFilter, Catch, InternalServerErrorException } from "@nestjs/common";

import { LoggerService } from "../../modules/logger";


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    public constructor(private readonly logger: LoggerService) {}

    public catch(error: Error, response) {
        this.logger.error(`Unhandled exception occurred`);
        this.logger.error((new InternalServerErrorException(error.message)).getResponse());
        this.logger.error(error);

        response
            .status(500)
            .json({
                message: "Something went wrong",
            });
    }
}
