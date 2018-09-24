import "bluebird-global";

import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";

import * as helmet from "helmet";

import { getNamespace } from "./modules/shared/cls";
import { ApplicationModule } from "./app.module";
import { SchemaValidationPipe } from "./http/pipes";
import { GlobalExceptionFilter } from "./http/filters";
import { LoggerDiToken, LoggerService, LoggerModule } from "./modules/logger";


async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    const logger: LoggerService = app.select(LoggerModule).get(LoggerDiToken.LOGGER);

    setClsMiddleware(app);
    app.use(helmet({
        hsts: false,
        hidePoweredBy: true,
    }));
    app.disable("etag");

    app.useGlobalPipes(new SchemaValidationPipe());
    app.useGlobalFilters(
            new GlobalExceptionFilter(logger),
    );
    app.setGlobalPrefix("/api");
    app.enableCors({
        origin: "*",
    });

    await app.listen(4101);
}
bootstrap();


function setClsMiddleware(app: INestApplication) {
    app.use((req, res, next) => {
        const cls = getNamespace();

        cls.bindEmitter(req);
        cls.bindEmitter(res);

        cls.run(() => next());
    });
}
