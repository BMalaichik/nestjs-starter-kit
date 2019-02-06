import { ApiModelProperty } from "@nestjs/swagger";

import { UserActivityDto } from "./user-activity.dto";


export class UserActivityDashboardDto extends UserActivityDto {
    @ApiModelProperty({ description: `Resolved activity dashboard message` })
    message: string;
}
