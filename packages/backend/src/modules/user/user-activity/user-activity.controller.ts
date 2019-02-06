import {
    Get,
    Query,
    Controller,
    Inject,
    UseGuards,
} from "@nestjs/common";

import { ApiUseTags } from "@nestjs/swagger";

import { AuthorizeGuard } from "../../auth/guards";
import { UserActivityDto } from "./dto";
import { UserActivityDiToken } from "./user-activity.di";
import { UserActivityService, UserActivityQuery } from "./services";


@ApiUseTags("UserActivity")
@Controller("/user-activity")
@UseGuards(AuthorizeGuard)
export class UserActivityController {

    public constructor(
        @Inject(UserActivityDiToken.USER_ACTIVITY_SERVICE) private readonly userActivityService: UserActivityService,
    ) { }

    @Get("/dashboard")
    public getDashboard(@Query() query: UserActivityQuery): Promise<UserActivityDto[]> {
        return this.userActivityService.getDashboard(query);
    }
}
