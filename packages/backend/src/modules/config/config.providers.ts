import * as nconf from "nconf";

import { ConfigDiToken } from "./config.di";

// TODO: extract nto single place, like app/core module
const env = process.env.NODE_ENV || "development";

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
    useFactory: () => nconf.get(),
};

export const configProviders = [
    configProvider,
];
