import { Module, MiddlewareConsumer, NestModule, Inject } from "@nestjs/common";

import { DbModule } from "../db";
import { AuthModule } from "../auth";
import { ConfigModule } from "../config";
import { fileProviders } from "./file.providers";
import { FileController } from "./file.controller";
import { register as registerTypeMappings } from "./file.type-mappings";
import { SharedModule, TypeMapperDiToken, TypeMapper } from "../shared";


@Module({
    imports: [DbModule, AuthModule, SharedModule, ConfigModule],
    providers: [...fileProviders],
    exports: [...fileProviders],
    controllers: [FileController],
})
export class FileModule implements NestModule {
    public constructor(
        @Inject(TypeMapperDiToken.MAPPER) private readonly mapper: TypeMapper,
    ) {
        registerTypeMappings(mapper);
    }

    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
