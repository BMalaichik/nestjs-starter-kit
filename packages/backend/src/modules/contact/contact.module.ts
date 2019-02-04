import { Module, MiddlewareConsumer, NestModule, Inject } from "@nestjs/common";

import { DbModule } from "../db";
import { contactProviders } from "./contact.providers";
import { PermissionModule } from "../auth/permission";
import { ContactController } from "./contact.controller";
import { register as registerTypeMappings } from "./contact.type-mappings";
import { TypeMapperDiToken, TypeMapper, SharedModule } from "../shared";


@Module({
    imports: [
        DbModule,
        SharedModule,
        PermissionModule,
    ],
    providers: [...contactProviders],
    exports: [...contactProviders],
    controllers: [ContactController],
})
export class ContactModule implements NestModule {
    public constructor(
        @Inject(TypeMapperDiToken.MAPPER) private readonly mapper: TypeMapper,
    ) {
        registerTypeMappings(mapper);
    }

    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
