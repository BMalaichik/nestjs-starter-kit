import { Module, NestModule, MiddlewareConsumer, forwardRef, Inject } from "@nestjs/common";

import { DbModule } from "../db";
import { AuthModule } from "../auth";
import { ConfigModule } from "../config";
import { userProviders } from "./user.providers";
import { ContactModule } from "../contact";
import { UserController } from "./user.controller";
import { UserActivityModule } from "./user-activity";
import { NotificationModule } from "../notification";
import { register as registerTypeMappings } from "./user.type-mappings";
import { SharedModule, TypeMapperDiToken, TypeMapper } from "../shared";



@Module({
    imports: [
        DbModule,
        forwardRef(() => AuthModule),
        ContactModule,
        SharedModule,
        NotificationModule,
        ConfigModule,
        UserActivityModule,
    ],
    controllers: [UserController],
    providers: [...userProviders],
    exports: [...userProviders],
})
export class UserModule implements NestModule {
    public constructor(
        @Inject(TypeMapperDiToken.MAPPER) private readonly mapper: TypeMapper,
    ) {
        registerTypeMappings(mapper);
    }

    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
