import { NestFactory } from "@nestjs/core";


import { CipherDiToken } from "../modules/shared/cipher/cipher.di";
import { CipherService } from "../modules/shared/cipher/cipher.service";
import { CipherModule } from "../modules/shared/cipher";


async function bootstrap() {
    const app = await NestFactory.create(CipherModule);
    const service: CipherService = app.get(CipherDiToken.CIPHER_SERVICE);
    const [keyId, text] = process.argv.slice(2);

    if (!keyId || !text) {
        throw new Error(`Invalid request, keyid & text should be provided`);
    }

    const secret = await service.encrypt({ text, keyId });

    console.log("-------------Done--------------");
    console.log(`ENCRYPTED SECRET:${secret}`);
    console.log("-------------Done--------------");
}

bootstrap();
