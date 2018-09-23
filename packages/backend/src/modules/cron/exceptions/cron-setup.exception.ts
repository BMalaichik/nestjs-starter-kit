export class CronSetupException extends Error {
    constructor(msg?: string) {
        super(msg  || `CRON setup exception occurred`);
        Object.setPrototypeOf(this, CronSetupException.prototype);
    }
}
