import { Config } from "../config.interfaces";

const config: Config = {
    db: {
        host: "localhost",
        username: "postgres",
        password: "password",
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
        tokenSecret: "pupik95+rob93=LOVE",
    },
    mailgun: {
        apiKey: "47615f5dedd1fd466e993abad09a0a98-0e6e8cad-8501f824\n",
        domain: "sandbox1acc7df2cc084bbb9793f1fd1786d126.mailgun.org"
    },
};


module.exports = config;
