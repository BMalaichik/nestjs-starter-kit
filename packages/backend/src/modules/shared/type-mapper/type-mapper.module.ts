import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { typeMapperProviders } from "./type-mapper.providers";


@Module({
    imports: [],
    providers: [...typeMapperProviders],
    exports: [...typeMapperProviders],
})
export class TypeMapperModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
