import * as moment from "moment";
import { NestMiddleware, Injectable, MiddlewareFunction } from "@nestjs/common";


@Injectable()
export class RequestMiddleware implements NestMiddleware {
    public resolve(...args: any[]): MiddlewareFunction {
        return (req: Request , res, next) => {
            const body = `${moment().format("YYYY-MM-DD HH:mm:ss")} [Request]:
            Url: ${req.url}
            Method: ${req.method}
            `;
            console.log(body); // TODO: use app logger, format log output
            next();
        };
    }
}
