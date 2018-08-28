import { Module, MiddlewaresConsumer, NestModule, Inject } from "@nestjs/common";

import { DbModule } from "../db";
import { contactProviders } from "./contact.providers";
import { TypeMapperModule, TypeMapperDiToken, TypeMapper, SharedModule } from "../shared";
import { ContactController } from "./contact.controller";
import { register as registerTypeMappings } from "./contact.type-mappings";


@Module({
    imports: [DbModule, SharedModule],
    components: [...contactProviders],
    exports: [...contactProviders],
    controllers: [ContactController],
})
export class ContactModule implements NestModule {
    public constructor(
        @Inject(TypeMapperDiToken.MAPPER) private readonly mapper: TypeMapper,
    ) {
        registerTypeMappings(mapper);
    }

    public configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {

    }
}
