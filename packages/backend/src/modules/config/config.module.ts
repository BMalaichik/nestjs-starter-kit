import { Module, NestModule, MiddlewaresConsumer, Global } from "@nestjs/common";

import { configProviders } from "./config.providers";


@Global()
@Module({
    components: [...configProviders],
    exports: [...configProviders],
})
export class ConfigModule implements NestModule {
    public configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {

    }
}
