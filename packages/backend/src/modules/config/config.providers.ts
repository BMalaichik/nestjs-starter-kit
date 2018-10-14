import * as _ from "lodash";
import * as nconf from "nconf";

import { Env } from "./config.interfaces";
import { ConfigDiToken } from "./config.di";
import { CipherService, CipherDiToken } from "../shared/cipher";


const env = process.env.NODE_ENV || Env.DEVELOPMENT;

nconf.use("memory");

nconf
    .defaults(require(`./env/config.default`))
    .overrides(require(`./env/config.${env}`))
    .argv({
        NODE_ENV: {
            default: "development",
        },
        example: {
            describe: "Example description for usage generation",
            demand: true,
            default: "some-value",
            parseValues: true,
        },
    })
    .env(["NODE_ENV"]); // set here available env variables to be loaded

export const configProvider = {
    provide: ConfigDiToken.CONFIG,
    useFactory: async (cipherService: CipherService) => {
        const config = nconf.get();
        const decryptedConfigs = await Promise.map(_.keys(config), async key => {
            const valueToDecrypt: any = config[key];
            const decryptedValue = _.isObject(valueToDecrypt) ?
                await cipherService.decryptObject(valueToDecrypt)
                : (await cipherService.decryptObject({ value: valueToDecrypt })).value; // wrapping-up non-object config

            return { [key]: decryptedValue };
        });

        return _.assign({}, ...decryptedConfigs);
    },
    inject: [CipherDiToken.CIPHER_SERVICE],
};

export const configProviders = [
    configProvider,
];
