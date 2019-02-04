import { ZipDiToken } from "./zip.di";
import { ZipService } from "./zip.service";


export const zipProviders = [
    {
        provide: ZipDiToken.ZIP_SERVICE,
        useClass: ZipService,
    },
];
