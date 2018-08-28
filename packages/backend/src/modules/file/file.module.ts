import { Module, MiddlewaresConsumer, NestModule, Inject } from "@nestjs/common";

import { DbModule } from "../db";
import { AuthModule } from "../auth";
import { fileProviders } from "./file.providers";
import { FileController } from "./file.controller";
import { register as registerTypeMappings } from "./file.type-mappings";
import { SharedModule, TypeMapperDiToken, TypeMapper } from "../shared";
import { ConfigModule } from "../config";


@Module({
    imports: [DbModule, ConfigModule, AuthModule, SharedModule],
    components: [...fileProviders],
    exports: [...fileProviders],
    controllers: [FileController],
})
export class FileModule implements NestModule {
    public constructor(
        @Inject(TypeMapperDiToken.MAPPER) private readonly mapper: TypeMapper,
    ) {
        registerTypeMappings(mapper);
    }

    public configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {

    }
}
