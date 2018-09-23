import { Config, Env } from "../config.interfaces";


const config: Config = {
    env: Env.PRODUCTION,
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
        url: "",
    },
    auth: {
        tokenExpiration: 60 * 60 * 24, // 1 day
        longTokenExpiration: 60 * 60 * 24 * 7 , // 1 week
        inviteTokenExpiration: 60 * 60, // 1 hour
        resetPasswordTokenExpiration: 60 * 60, // 1 hour
        tokenSecret: "fr2po3758ur0[uaDS {(YQb *gatH 9PUH Eut5goi234dfsgwegfewsrg",
        inviteTokenSecret: "kpoiuw304ohHJKnjKJHHJLKJm098iPOK9[oujiIUGY879u",
        resetPasswordTokenSecret: "328kdr3209rikpowrfmwkljhpok,IUOYjoilkmLKnlk",
    },
};


module.exports = config;
