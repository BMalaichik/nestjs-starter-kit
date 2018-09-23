import * as _ from "lodash";

import { RecurrenceRule } from "node-schedule";

import { Job } from "./jobs";
import { CronSetupException } from "./exceptions";


export abstract class CronJob {
    abstract id: Job;
    abstract execute(): Promise<void>;
}

export class CronConfig {

    public constructor(values: CronConfig) {
        _.assign(this, values);

        this.retryOnFail = values.retryOnFail || false;

        CronConfig.validate(this);
    }

    public static validate(config: CronConfig) {
        if (!(config instanceof CronConfig )) {
            throw new CronSetupException(`Config must be an instance of CronConfig class`);
        }

        if (!config.rule) {
            throw new CronSetupException(`No cron rule specified in config`);
        }

        if (!config.job || !(config.job instanceof CronJob )) {
            throw new CronSetupException(`Config job is not properly set, must be an instance of CronJob class`);
        }

        if (!_.isFunction(config.job.execute)) {
            throw new CronSetupException(`No cron handler specified in config`);
        }
    }

    public job: CronJob;
    public rule: string | Date | RecurrenceRule;
    public retryOnFail: boolean;
}
