import { Injectable } from "@nestjs/common";

import { Job } from "../jobs";
import { CronJob } from "../cron.types";


@Injectable()
export class SampleCronJob extends CronJob {
    public id: Job = Job.SAMPLE;

    public async execute(): Promise<void> {
        await Promise.delay(3000);
    }
}

