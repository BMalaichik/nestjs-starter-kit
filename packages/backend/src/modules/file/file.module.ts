import { Module, MiddlewareConsumer, NestModule, Inject } from "@nestjs/common";

import { DbModule } from "../db";
import { AuthModule } from "../auth";
import { ConfigModule } from "../config";
import { fileProviders } from "./file.providers";
import { FileController } from "./file.controller";
import { register as registerTypeMappings } from "./file.type-mappings";
import { SharedModule, TypeMapperDiToken, TypeMapper } from "../shared";

/**
 *  File Management abilities.
 *  Providers API for uploading, delete & downloading files.
 *  {@link FileDto} - in-system file representation. Reflected in `file` table.
 *  {@link S3FileStorage} - S3 based storage class.
 *  {@link PdfFileGeneratorSErvice} - API for generating & storing PDF files based on predefined templates.
 *  {@link FileService} - High-level API for inernal file-management
 */
@Module({
    imports: [
        DbModule,
        AuthModule,
        SharedModule,
        ConfigModule,
    ],
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
