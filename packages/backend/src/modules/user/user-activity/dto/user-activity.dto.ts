import { ApiModelProperty } from "@nestjs/swagger";

import { BaseDto } from "../../../../base.dto";
import { UserDto } from "../../dto";
import { ActivityAction } from "../../../db";



export class UserActivityDto extends BaseDto {
    public id: number;

    @ApiModelProperty()
    public date: Date;

    @ApiModelProperty({ enum: ActivityAction })
    public action: ActivityAction;

    @ApiModelProperty()
    public payload: any;

    @ApiModelProperty()
    public author: string;
    public performedByUserId: number;

    @ApiModelProperty()
    public performedBy?: UserDto;
}
