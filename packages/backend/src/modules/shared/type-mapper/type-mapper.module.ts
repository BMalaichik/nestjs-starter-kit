import { Module, MiddlewaresConsumer, NestModule } from "@nestjs/common";

import { typeMapperProviders } from "./type-mapper.providers";


@Module({
    imports: [],
    components: [...typeMapperProviders],
    exports: [...typeMapperProviders],
})
export class TypeMapperModule implements NestModule {
    public configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {

    }
}
