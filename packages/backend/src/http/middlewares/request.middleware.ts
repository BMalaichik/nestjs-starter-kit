import { LoggerDiToken, LoggerService } from "../../modules/logger";
import { NestMiddleware, Injectable, MiddlewareFunction, Inject } from "@nestjs/common";

import * as moment from "moment";


@Injectable()
export class RequestMiddleware implements NestMiddleware {
    public constructor(@Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService) {
    }

    public resolve(...args: any[]): MiddlewareFunction {
        return (req , res, next) => {
            const body = `${moment().format("YYYY-MM-DD HH:mm:ss")} [Request]:
            Url: ${req.originalUrl}
            Method: ${req.method}
            `;
            this.logger.log(body);

            next();
        };
    }
}
