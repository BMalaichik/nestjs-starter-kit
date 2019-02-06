import { Module, NestModule, MiddlewareConsumer, Inject, RequestMethod } from "@nestjs/common";

import { DbModule } from "./modules/db";
import { GeoModule } from "./modules/geo";
import { FileModule } from "./modules/file";
import { CronModule } from "./modules/cron";
import { UserModule } from "./modules/user";
import { AuthModule } from "./modules/auth";
import { CipherModule } from "./modules/shared/cipher";
import { GlobalModule } from "./modules/global";
import { SharedModule } from "./modules/shared";
import { LoggerModule } from "./modules/logger";
import { AppController } from "./app.controller";
import { RequestMiddleware } from "./http/middlewares/request.middleware";
import { NotificationModule } from "./modules/notification";
import { Config, ConfigModule, ConfigDiToken } from "./modules/config";


@Module({
    imports: [
        CipherModule,
        ConfigModule,
        SharedModule,
        DbModule,
        AuthModule,
        UserModule,
        GlobalModule,
        NotificationModule,
        FileModule,
        LoggerModule,
        CronModule,
        GeoModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class ApplicationModule implements NestModule {
    public constructor(
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
    ) {}
    public configure(consumer: MiddlewareConsumer): void {
        if (this.config.app.logRequests) {
            consumer
                .apply(RequestMiddleware)
                .forRoutes({
                    path: "*",
                    method: RequestMethod.ALL,
                });
        }
    }
}
