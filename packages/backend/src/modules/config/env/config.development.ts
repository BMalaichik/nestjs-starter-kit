import { Config } from "../config.interfaces";

const config: Config = {
    db: {
        host: "db",
        username: "postgres",
        password: "root",
        port: 5432,
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
    },
    auth: {
        tokenExpiration: 60 * 60 * 60,
        tokenSecret: "",
    },
};


module.exports = config;
