import "bluebird-global";

import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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

    app.useGlobalPipes(
        new SchemaValidationPipe(),
    );
    app.useGlobalFilters(
        new GlobalExceptionFilter(logger),
    );
    app.setGlobalPrefix("/api");
    app.enableCors({
        origin: "*",
    });

    setupSwagger(app);
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

function setupSwagger(app) {
    const options = new DocumentBuilder()
        .setTitle(`NestJS Starter-Kit API`)
        .setDescription(``)
        .setVersion(`1.0`)
        .setBasePath(`/api`)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`api/docs`, app, document);
}
