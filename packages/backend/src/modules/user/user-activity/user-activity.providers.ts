import { UserActivityDiToken } from "./user-activity.di";
import { ActivityMessageMappingService, UserActivityService } from "./services";


export const userActivityProviders = [
    {
        provide: UserActivityDiToken.ACTIVITY_MESSAGE_MAPPING_SERVICE,
        useClass: ActivityMessageMappingService,
    },
    {
        provide: UserActivityDiToken.USER_ACTIVITY_SERVICE,
        useClass: UserActivityService,
    },
];
