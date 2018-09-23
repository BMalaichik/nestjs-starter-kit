import "bluebird-global";
import { Inject, Injectable } from "@nestjs/common";

import * as _ from "lodash";
import { KMS } from "aws-sdk";
import { promisify } from "bluebird";

import { CipherDiToken } from "./cipher.di";

export const SECRET_PREFIX = "secret:";

@Injectable()
export class CipherService {

    public constructor(
        @Inject(CipherDiToken.KMS) private readonly kms: KMS,
    ) {}

    /**
     * @param data - plain object with encrypted fields
     */
    public async decryptObject(data: any): Promise<any> {
        const decryptAsync = promisify(this.kms.decrypt, { context: this.kms }) as any;
        const secretKeys = _.keys(data).filter(key => data[key].toString().startsWith(SECRET_PREFIX));
        const result = {};

        await Promise.map(secretKeys, async key => {
            let response: KMS.DecryptResponse;
            const secretValue: string = (data[key] as string).slice(SECRET_PREFIX.length);

            try {
                response = await decryptAsync({ CiphertextBlob: new Buffer(secretValue, "base64") });
            } catch (err) {
                console.log(err);
                throw new Error(`Decryption failed`);
            }

            result[key] = response.Plaintext.toString();
        });

        return _.assign({}, data, result);
    }

    /**
     *  Method returns encrypted text value
     */
    public async encrypt({ text, keyId  }: { text: string, keyId: string }): Promise<string> {
        const promisifiedEncrypt = promisify(this.kms.encrypt, { context: this.kms }) as any;

        let response: KMS.EncryptResponse;

        try {
            response = await promisifiedEncrypt({ KeyId: keyId, Plaintext: text });
        } catch (err) {
            console.log(err);
            throw new Error(`Encryption failed`);
        }

        return (response.CiphertextBlob as Buffer).toString("base64");
    }
}
