import { Module, MiddlewaresConsumer, NestModule } from "@nestjs/common";

import { notificationProviders } from "./notification.providers";
import { NotificationController } from "./notification.controller";
import { ConfigModule } from "../config";


@Module({
    imports: [ConfigModule],
    components: [...notificationProviders],
    exports: [...notificationProviders],
    controllers: [NotificationController],
})
export class NotificationModule implements NestModule {
    public configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {

    }
}
