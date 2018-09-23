import { Inject, Injectable } from "@nestjs/common";

import * as _ from "lodash";

import { CronConfig } from "../cron.types";
import { CronService } from "./cron.service";
import { CronDiToken } from "../cron.di";
import { SampleCronJob } from "../jobs";
import { CronSetupException } from "../exceptions";
import { LoggerService, LoggerDiToken } from "../../logger";


@Injectable()
export class JobRegisterService {
    // Inject here jobs & add relevant config entry
    public constructor(
        private readonly sampleJob: SampleCronJob,
        @Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService,
        @Inject(CronDiToken.CRON_SERVICE) private readonly cronService: CronService,
    ) {}

    public init() {
        const configs: CronConfig[] = [
            new CronConfig({ job: this.sampleJob, rule: "30 0 * * *", retryOnFail: false }),
        ];

        _.each(configs, (cronJobConfig: CronConfig) => {
            try {
                this.cronService.register(cronJobConfig);
            } catch (err) {
                this.logger.error(`Error occurred registering cron job`);
                this.logger.error(err);

                throw new CronSetupException(err);
            }
        });
    }
}
