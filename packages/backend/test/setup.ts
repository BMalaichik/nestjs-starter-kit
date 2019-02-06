import { Test } from "@nestjs/testing";

import * as _ from "lodash";

import { ApplicationModule } from "../src/app.module";
import { LoggerModule, LoggerDiToken, LoggerService } from "../src/modules/logger";
import { GlobalExceptionFilter, SchemaValidationPipe } from "../src/http";


module.exports = async () => {
    const module = await Test.createTestingModule({
        controllers: [],
        imports: [ApplicationModule],
    }).compile();
    const logger: LoggerService = module.select(LoggerModule).get(LoggerDiToken.LOGGER);
    const app = await module.createNestApplication();

    app.useGlobalPipes(
        new SchemaValidationPipe(),
    );
    app.useGlobalFilters(
        new GlobalExceptionFilter(logger),
    );

    await app.init();
    _.assign(
        global,
        {
            APP: app,
            SERVER: app.getHttpServer(),
        },
    );

    return app;
};
