import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { zipProviders } from "./zip.providers";


@Module({
    imports: [],
    providers: [...zipProviders],
    exports: [...zipProviders],
})
export class ZipModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
