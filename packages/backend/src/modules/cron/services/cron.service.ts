import * as _ from "lodash";
import { scheduleJob } from "node-schedule";
import { Injectable, Inject } from "@nestjs/common";

import * as moment from "moment";
import { Sequelize } from "sequelize-typescript";

import { CronConfig } from "../cron.types";
import { BaseService } from "../../../base.service";
import { CronJobException } from "../exceptions";
import { LoggerDiToken, LoggerService } from "../../logger";
import { DbDiToken, TimeBasedEvent, TimeBasedEventStatus } from "../../db";


@Injectable()
export class CronService extends BaseService {

    public constructor(
        @Inject(DbDiToken.TIME_BASED_EVENT_REPOSITORY) private readonly timeBasedEventRepository: typeof TimeBasedEvent,
        @Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService,
        @Inject(DbDiToken.SEQUELIZE_CONNECTION) private readonly sequelize: Sequelize,

    ) {
        super();
    }

    public register(config: CronConfig): void {
        CronConfig.validate(config);

        scheduleJob(config.job.id, config.rule, async () => {
            try {
                await this.runJob(config);
            } catch (err) {
                this.logger.error(`Unhandled exception occurred executing scheduled job`);
                this.logger.error(err);
            }
        });

        this.logger.log(`Time-based-event '${config.job.id}' successfully scheduled with plan ${config.rule}`);
    }

    protected async runJob(config: CronConfig): Promise<void> {
        let endDate: moment.Moment;
        const startDate: moment.Moment = moment();
        this.logger.log(`Executing scheduled job '${config.job.id}'`);

        const eventRecord: TimeBasedEvent = {
            startDate: startDate.toDate(),
            status: TimeBasedEventStatus.STARTED,
            code: config.job.id,
        } as TimeBasedEvent;

        const event: TimeBasedEvent = (await this.timeBasedEventRepository.create(eventRecord)).toJSON();

        try {
            await this.executeJob(config);
        } catch (err) {
            await this.handleJobExecutionError(config, event.id, err);
            return;
        }

        endDate = moment();
        const updatedEventRecord: TimeBasedEvent = {
            endDate: endDate.toDate(),
            status: TimeBasedEventStatus.COMPLETED,
            code: config.job.id,
        } as TimeBasedEvent;

        await this.timeBasedEventRepository.update(
            updatedEventRecord,
            { where: { id: event.id }, fields: ["status", "endDate"], limit: 1 },
        );

        this.logger.log(`Scheduled job '${config.job.id}' execution finished. Elapsed time: ${endDate.diff(startDate, "seconds")} seconds`);
    }

    protected async executeJob(config: CronConfig, isRetryAttempt: boolean = false): Promise<void> {
        return config.job
            .execute()
            .catch((err) => {
                if (!config.retryOnFail || isRetryAttempt) {
                    return Promise.reject(err);
                }

                return this.executeJob(config, true);
            });
    }

protected async handleJobExecutionError(config: CronConfig, eventId: number, error: any): Promise<void> {
        this.logger.error(`Error occurred executing job '${config.job.id}'`);
        this.logger.error(new CronJobException(error));

        const updatedEventRecord: TimeBasedEvent = {
            endDate: new Date(),
            status: TimeBasedEventStatus.ERROR,
            code: config.job.id,
            info: {
                error: this.jsonFormatError(error),
            },
        } as TimeBasedEvent;

        await this.timeBasedEventRepository.update(
            updatedEventRecord,
            {
                where: { id: eventId },
                fields: ["status", "endDate", "info"], limit: 1 },
        );
    }

    // TODO: move to shared place
    private jsonFormatError(err: any): any {
        const res = {};

        Object.getOwnPropertyNames(err).forEach((key) => {
            res[key] = err[key];
        });

        return res;
    }
}
