import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

import { configProviders } from "./config.providers";
import { CipherModule } from "../shared/cipher";

@Module({
    imports: [CipherModule],
    providers: [...configProviders],
    exports: [...configProviders],
})
export class ConfigModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
