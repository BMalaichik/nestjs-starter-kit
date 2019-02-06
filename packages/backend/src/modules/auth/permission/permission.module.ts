import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

import { DbModule } from "../../db";
import { LoggerModule } from "../../logger";
import { permissionProviders } from "./permission.providers";


@Module({
    imports: [
        DbModule,
        LoggerModule,
    ],
    providers: [...permissionProviders],
    exports: [...permissionProviders],
    controllers: [],
})
export class PermissionModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
    }
}
