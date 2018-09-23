import { Config, Env } from "../config.interfaces";

const config: Config = {
    env: Env.DEVELOPMENT,
    db: {
        host: "db",
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
        url: "localhost:4101",
    },
    auth: {
        tokenExpiration: 60 * 60 * 24, // 1 day
        longTokenExpiration: 60 * 60 * 24 * 7 , // 1 week
        inviteTokenExpiration: 60 * 60, // 1 hour
        tokenSecret: "235t3ouiwrghjnme;owlfhu34o8trfnwof32pi4t2poghn5t8ogh3eigj",
        inviteTokenSecret: "f34t6ergdsefgert2we;AWRsadf12rewfsads",
        resetPasswordTokenExpiration: 60 * 60,
        resetPasswordTokenSecret: "fASJfs234rHjkmnXqk324;lm,Xkjade",
    },
};


module.exports = config;
