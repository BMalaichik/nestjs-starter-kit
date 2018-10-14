import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

import { configProviders } from "./config.providers";
import { CipherModule } from "../shared/cipher";


/**
 *  Application configuration module. Build upon [NConf](https://www.npmjs.com/package/nconf) module.
 *  Provides application-shared env-based configuration module.
 *  Checkout `env` directory for env-based configs. Loaded dynamically during application bootstrap.
 *  Uses {@link CipherModule} to decrypt secrets.
 */
@Module({
    imports: [CipherModule],
    providers: [...configProviders],
    exports: [...configProviders],
})
export class ConfigModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
