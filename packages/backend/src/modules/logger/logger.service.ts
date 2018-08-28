import { LoggerService as NestLoggerService, Component } from "@nestjs/common";

import * as pino from "pino";


@Component()
export class LoggerService implements NestLoggerService {
    private logger: pino.BaseLogger;

    constructor(
        options: { name?: string; level?: string; prettyPrint?: boolean | object, prettifier?: any },
    ) {
        this.logger = pino(options);
    }

    public log(message: any) {
        this.logger.info(message);
    }

    public error(message: any) {
        this.logger.error(message);
    }

    public warn(message: any) {
        this.logger.warn(message);
    }
}
