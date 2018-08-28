import { Middleware, NestMiddleware, ExpressMiddleware } from "@nestjs/common";

import * as _ from "lodash";
import * as passport from "passport";

import { CurrentUserService } from "./services/current-user.service";


@Middleware()
export class AuthMiddleware implements NestMiddleware {
    public resolve(currentUserService: CurrentUserService): ExpressMiddleware | Promise<ExpressMiddleware> | Promise<Promise<ExpressMiddleware>> {
        return (req, res, next) => {
            passport.authenticate("jwt", { session: false }, (info, userData, err) => {
                if (err) {
                    // TODO: add proper error handling with type checking & logging
                    req.user = false;
                } else {
                    req.user = userData;
                    currentUserService.set(_.cloneDeep(userData));
                }

                next();
            })(req, res, next);

        };
    }
}
