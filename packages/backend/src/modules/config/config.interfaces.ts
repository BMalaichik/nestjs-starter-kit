export interface Config {
    NODE_ENV?: string;
    db?: {
        host: string,
        username: string;
        password: string;
        dialect: string;
        port: number,
        database: string,
        logging?: any,
    };
    storage?: {
        bucket: string,
        prefix: string;
    };
    app?: {
        logRequests?: boolean,
        adminEmail?: string[];
    };
    auth?: {
        tokenSecret: string;
        tokenExpiration: number; // seconds
    };
    mailgun?: {
        apiKey: string;
        domain: string;
    };
}
