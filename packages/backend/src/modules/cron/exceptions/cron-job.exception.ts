export class CronJobException extends Error {
    constructor(msg?: string) {
        super(msg  || `CRON job execution exception occurred`);
        Object.setPrototypeOf(this, CronJobException.prototype);
    }
}
