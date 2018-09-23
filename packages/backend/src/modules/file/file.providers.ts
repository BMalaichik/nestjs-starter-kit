import { s3Factory } from "./storage/s3";
import { FileDiToken } from "./file.di";
import { S3FileStorage } from "./storage/file-storage";
import { S3FileStorageConfigurationFactory } from "./storage";
import { PdfFileGeneratorService, FileService } from "./services";


export const fileProviders = [
    {
        provide: FileDiToken.PDF_FILE_GENERATOR_SERVICE,
        useClass: PdfFileGeneratorService,
    },
    {
        provide: FileDiToken.FILE_SERVICE,
        useClass: FileService,
    },
    {
        provide: FileDiToken.FILE_STORAGE,
        useClass: S3FileStorage,
    },
    {
        provide: FileDiToken.S3,
        useValue: s3Factory(),
    },
    {
        provide: FileDiToken.FILE_STORAGE_CONFIGURATION_FACTORY,
        useClass: S3FileStorageConfigurationFactory,
    },
];
