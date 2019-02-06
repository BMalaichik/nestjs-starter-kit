import { Injectable, Inject } from "@nestjs/common";

import * as _ from "lodash";
import * as moment from "moment";
import { Op } from "sequelize";
import { IFindOptions } from "sequelize-typescript";

import { BaseService } from "../../../../base.service";
import { MomentDateFormat } from "../../../shared/date";
import { UserActivityDiToken } from "../user-activity.di";
import { TypeMapper, TypeMapperDiToken } from "../../../shared";
import { ActivityMessageMappingService } from "./activity-message-mapping.service";
import { PermissionService, PermissionDiToken } from "../../../auth/permission";
import { UserActivityDto, UserActivityDashboardDto } from "../dto";
import { ValidatorService, EnumValueValidator, NotNilValidator } from "../../../shared/validator";
import { DbDiToken, UserActivity, ActivityAction, User, Contact } from "../../../db";
import { AuthDiToken, CurrentUserService, PermissionContextService, JwtUserData } from "../../../auth";


export interface UserActivityQuery {
    userId?: number;
    actions?: ActivityAction[];
    from?: Date;
    to?: Date;
}

@Injectable()
export class UserActivityService extends BaseService {

    public constructor(
        @Inject(DbDiToken.USER_ACTIVITY_REPOSITORY) private readonly repository: typeof UserActivity,
        @Inject(DbDiToken.USER_REPOSITORY) private readonly userRepository: typeof User,
        @Inject(AuthDiToken.CURRENT_USER_SERVICE) private readonly currentUserService: CurrentUserService,
        @Inject(TypeMapperDiToken.MAPPER) private readonly typeMapper: TypeMapper,
        @Inject(AuthDiToken.PERMISSION_CONTEXT_SERVICE) private readonly permissionContextService: PermissionContextService,
        @Inject(PermissionDiToken.PERMISSION_SERVICE) private readonly permissionService: PermissionService,
        @Inject(UserActivityDiToken.ACTIVITY_MESSAGE_MAPPING_SERVICE) private readonly activityMessageMappingService: ActivityMessageMappingService,
    ) {
        super();
    }

    public async track(action: ActivityAction, payload: any = {}): Promise<UserActivityDto> {
        const currentUser: JwtUserData = this.currentUserService.get();
        const activity: UserActivityDto = new UserActivityDto({
            performedByUserId: currentUser.id,
            author: currentUser.name,
            action,
            date: new Date(),
            payload,
        });
        ValidatorService.compose([
            new EnumValueValidator(ActivityAction, "Action", "action"),
            new NotNilValidator("User Id", "performedByUserId"),
            new NotNilValidator("Author", "author"),
        ])(activity);

        const createdActivity = await this.repository.create(activity);

        return this.typeMapper.map(UserActivity, UserActivityDto, createdActivity);
    }

    public async getDashboard(query: UserActivityQuery): Promise<any[]> {
        const options: IFindOptions<UserActivity> = {
            order: [["id", "desc"]],
            include: [
                {
                    model: User,
                    as: "performedBy",
                    required: true,
                    include: [{ model: Contact, as: "contact" }],
                },
            ],
            where: {},
        };

        if (!_.isEmpty(query.actions)) {
            _.each(query.actions, action => {
                ValidatorService.compose([
                    new EnumValueValidator(UserActivity, "Action"),
                ])(action);
            });

            _.assign(options.where, {
                action: { [Op.in]: query.actions },
            });
        }

        if (!!query.userId) {
            _.assign(options.where, {
                performedByUserId: query.userId,
            });
        }

        if (!!query.from) {
            _.merge(options.where, { date: { $gte: moment(query.from, MomentDateFormat.DEFAULT_DASHED).startOf("day").toDate() } });
        }

        if (!!query.to) {
            _.merge(options.where, { date: { $lte: moment(query.to, MomentDateFormat.DEFAULT_DASHED).endOf("day").toDate() } });
        }

        const activities: UserActivity[] = await this.repository.findAll(options);

        return _.map(activities, activity => {
            const dto: UserActivityDashboardDto = this.typeMapper.map(UserActivity, UserActivityDto, activity) as any;

            dto.message = this.activityMessageMappingService.map(
                this.resolveTemplate(dto),
                _.assign({}, dto.payload, { author: dto.author }),
            );

            return _.omit(dto, ["performedBy"]);
        });
    }

    private resolveTemplate(activity: UserActivityDto): string {
        return activity.action;
    }
}
