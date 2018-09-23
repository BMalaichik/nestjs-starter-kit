import { Module, NestModule, MiddlewaresConsumer, Inject, RequestMethod, forwardRef } from "@nestjs/common";

import { DbModule } from "./modules/db";
import { UserModule } from "./modules/user";
import { AuthModule } from "./modules/auth";
import { GlobalModule } from "./modules/global";
import { SharedModule } from "./modules/shared";
import { AppController } from "./app.controller";
import { RequestMiddleware } from "./http/middlewares/request.middleware";
import { NotificationModule } from "./modules/notification";
import { Config, ConfigModule, ConfigDiToken } from "./modules/config";
import { FileModule } from "./modules/file";
import { LoggerModule } from "./modules/logger";
import { ContactModule } from "./modules/contact";
import { ProductModule } from "./modules/product";


@Module({
  imports: [
      DbModule,
      AuthModule,
      UserModule,
      GlobalModule,
      ConfigModule,
      NotificationModule,
      FileModule,
      SharedModule,
      LoggerModule,
      ContactModule,
      ProductModule
    ],
  controllers: [AppController],
  components: [],
})
export class ApplicationModule implements NestModule {
    public constructor(
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
    ) {}
    public configure(consumer: MiddlewaresConsumer): void {
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
