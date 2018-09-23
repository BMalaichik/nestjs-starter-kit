import { Config } from "../config.interfaces";


const config: Config = {
    NODE_ENV: "production",
    db: {
        // Secrets storing:
        // Put kms-encrypted key with 'secret:' prefix.
        // During app init, key would be decrypted
        // example
        // host: "secret:423rolhijuwqhhg23ra@#e23p4kf,lqw;,fkwer5k2[3plrqwf287yrwoeijf",
        host: "localhost",
        username: "postgres",
        password: "root",
        port: "5432",
        dialect: "postgres",
        database: "app",
        logging: false,
    },
    storage: {
        bucket: "",
        prefix: "",
    },
    app: {
        logRequests: true,
        adminEmail: [],
    },
    auth: {
        tokenExpiration: 60 * 60 * 60,
        tokenSecret: "",
    },
};


module.exports = config;
