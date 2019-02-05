import { Config, Env } from "../config.interfaces";

const config: Config = {
    env: Env.TEST,
    db: {
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
        logRequests: false,
        url: "localhost:4101",
    },
    auth: {
        tokenExpiration: 60 * 60 * 24, // 1 day
        longTokenExpiration: 60 * 60 * 24 * 7 , // 1 week
        inviteTokenExpiration: 60 * 60, // 1 hour
        tokenSecret: "so_secret",
        inviteTokenSecret: "so_secret[2]",
        resetPasswordTokenExpiration: 60 * 60,
        resetPasswordTokenSecret: "so_secret[3]",
    },
};


module.exports = config;
