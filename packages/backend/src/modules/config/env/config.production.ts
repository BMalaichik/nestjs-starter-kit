import { Config } from "../config.interfaces";


const config: Config = {
    NODE_ENV: "production",
    db: {
        host: "localhost",
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
        adminEmail: [],
    },
    auth: {
        tokenExpiration: 60 * 60 * 60,
        tokenSecret: "",
    },
};


module.exports = config;
