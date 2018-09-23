import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { ConfigModule } from "../config";
import { notificationProviders } from "./notification.providers";


@Module({
    imports: [ConfigModule],
    providers: [...notificationProviders],
    exports: [...notificationProviders],
    controllers: [],
})
export class NotificationModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
