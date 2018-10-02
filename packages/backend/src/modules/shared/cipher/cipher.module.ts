import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { cipherProviders } from "./cipher.providers";

/**
 *  Module provides ability to encrypt\decrypt secrets.
 *  Current implementation is based on AWS KMS service.
 *  Usage sample can be found in providers of {@link ConfigModule}.
 *  Main idea is to allow storing secret's in secret way, without commiting sensitive data in VCS.
 *  Secrets are decrypted during {@link ConfigModule}  bootstrapping.
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
