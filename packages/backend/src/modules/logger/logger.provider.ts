import * as _ from "lodash";

import { LoggerDiToken } from "./logger.di";
import { LoggerService } from "./logger.service";
import { ConfigDiToken, Config, Env } from "../config";

// TODO: define logger-factory, using pino.child with extra property add
export const loggerProviders = [
    {
        provide: LoggerDiToken.LOGGER,
        useFactory: async (config: Config) => {
            const opts = _.assign(
                {},
                config.env === Env.PRODUCTION ?
                    {} :
                    {
                        prettyPrint: {
                            translateTime: true,
                        },
                    },
            );

            return new LoggerService(opts);
        },
        inject: [ConfigDiToken.CONFIG],
    },
];
