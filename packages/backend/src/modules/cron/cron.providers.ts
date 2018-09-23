import { CronDiToken } from "./cron.di";
import { CronService } from "./services";
import { JobRegisterService } from "./services/job-register.service";

// Jobs
import {
    SampleCronJob,
} from "./jobs";


const jobsProviders = [
    {
        provide: SampleCronJob,
        useClass: SampleCronJob,
    },
];

export const cronProviders = [
    ...jobsProviders,
    {
        provide: CronDiToken.CRON_SERVICE,
        useClass: CronService,
    },
    {
        provide: CronDiToken.JOB_REGISTER_SERVICE,
        useClass: JobRegisterService,
    },
];
