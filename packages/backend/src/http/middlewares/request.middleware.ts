import * as moment from "moment";
import { NestMiddleware, Middleware, ExpressMiddleware, Request } from "@nestjs/common";


@Middleware()
export class RequestMiddleware implements NestMiddleware {
    public resolve(...args: any[]): ExpressMiddleware | Promise<ExpressMiddleware> | Promise<Promise<ExpressMiddleware>> {
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
