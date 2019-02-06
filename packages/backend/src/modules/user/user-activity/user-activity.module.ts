import { Module, NestModule, MiddlewareConsumer, forwardRef } from "@nestjs/common";

import { DbModule } from "../../db";
import { AuthModule } from "../../auth";
import { SharedModule } from "../../shared";
import { PermissionModule } from "../../auth/permission";
import { userActivityProviders } from "./user-activity.providers";


@Module({
    imports: [
        DbModule,
        forwardRef(() => AuthModule),
        PermissionModule,
        SharedModule,
    ],
    controllers: [],
    providers: [...userActivityProviders],
    exports: [...userActivityProviders],
})
export class UserActivityModule implements NestModule {

    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
