import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { sharedProviders } from "./shared.providers";
import { TypeMapperModule } from "./type-mapper";


@Module({
    imports: [TypeMapperModule],
    providers: [...sharedProviders],
    exports: [TypeMapperModule, ...sharedProviders],
})
export class SharedModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
