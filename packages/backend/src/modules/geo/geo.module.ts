import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { geoProviders } from "./geo.providers";
import { ConfigModule } from "../config";
import { LoggerModule } from "../logger";


@Module({
    imports: [
        ConfigModule,
        LoggerModule,
    ],
    providers: [...geoProviders],
    exports: [...geoProviders],
})
export class GeoModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
