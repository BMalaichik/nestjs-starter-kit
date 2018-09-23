import { kmsFactory } from "./kms";
import { CipherDiToken } from "./cipher.di";
import { CipherService } from "./cipher.service";


export const cipherProviders = [
    {
        provide: CipherDiToken.CIPHER_SERVICE,
        useClass: CipherService,
    },
    {
        provide: CipherDiToken.KMS,
        useFactory: kmsFactory,
    },
];
