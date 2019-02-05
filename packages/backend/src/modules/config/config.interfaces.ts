export enum Env {
    DEVELOPMENT = "development",
    PRODUCTION = "production",
    TEST = "test",
}

export interface Config {
    env?: Env;
    db?: {
        host: string,
        username: string;
        password: string;
        dialect: string;
        port: string,
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
        url?: string;
    };
    auth?: {
        tokenSecret: string;
        tokenExpiration: number; // seconds
        inviteTokenSecret: string;
        inviteTokenExpiration: number;
        resetPasswordTokenSecret: string;
        resetPasswordTokenExpiration: number;
        longTokenExpiration: number; // seconds
    };
    mailgun?: {
        apiKey: string;
        domain: string;
    };
}
