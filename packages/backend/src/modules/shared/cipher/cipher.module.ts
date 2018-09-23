import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { cipherProviders } from "./cipher.providers";

/**
 *  Module provides ability to encrypt\descrypt secrets
 *  Usage sample can be found in modules/db/db.providers.ts file
 */
@Module({
    imports: [],
    providers: [...cipherProviders],
    exports: [...cipherProviders],
})
export class CipherModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
