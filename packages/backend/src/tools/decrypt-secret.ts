import { NestFactory } from "@nestjs/core";


import { CipherDiToken } from "../modules/shared/cipher/cipher.di";
import { CipherService } from "../modules/shared/cipher/cipher.service";
import { CipherModule } from "../modules/shared/cipher";


async function bootstrap() {
    const app = await NestFactory.create(CipherModule);
    const service: CipherService = app.get(CipherDiToken.CIPHER_SERVICE);
    const [keyId, secret] = process.argv.slice(2);

    if (!keyId || !secret) {
        throw new Error(`Invalid request, keyid & secret should be provided`);
    }

    const data = await service.decryptObject({ secret });

    console.log("-------------Done--------------");
    console.log(`DECRYPTED SECRET:${data.secret}`);
    console.log("-------------Done--------------");
}

bootstrap();
