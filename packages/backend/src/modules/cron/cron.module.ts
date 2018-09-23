import { JobRegisterService } from "./services/job-register.service";
import { Module, MiddlewareConsumer, NestModule, Inject } from "@nestjs/common";

import * as _ from "lodash";

import { DbModule } from "../db";
import { CronDiToken } from "./cron.di";
import { SharedModule } from "../shared";
import { cronProviders } from "./cron.providers";


@Module({
    imports: [
        DbModule,
        SharedModule,
    ],
    providers: [...cronProviders],
    exports: [...cronProviders],
    controllers: [],
})
export class CronModule implements NestModule {

    public constructor(
        @Inject(CronDiToken.JOB_REGISTER_SERVICE) private readonly jobRegisterService: JobRegisterService,
    ) {}
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
        this.jobRegisterService.init();
    }
}
