import { Module, MiddlewaresConsumer, NestModule } from "@nestjs/common";

import { sharedProviders } from "./shared.providers";
import { TypeMapperModule } from "./type-mapper";


@Module({
    imports: [TypeMapperModule],
    components: [...sharedProviders],
    exports: [TypeMapperModule, ...sharedProviders],
})
export class SharedModule implements NestModule {
    public configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {

    }
}
