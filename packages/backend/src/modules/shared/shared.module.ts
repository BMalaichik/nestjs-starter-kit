import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { CipherModule } from "./cipher";
import { sharedProviders } from "./shared.providers";
import { TypeMapperModule } from "./type-mapper";

/**
 *  Aggregates basic modules to be used accross application to avoid multiple imports
 *
 */
@Module({
    imports: [TypeMapperModule, CipherModule],
    providers: [...sharedProviders],
    exports: [CipherModule, TypeMapperModule, ...sharedProviders],
})
export class SharedModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
