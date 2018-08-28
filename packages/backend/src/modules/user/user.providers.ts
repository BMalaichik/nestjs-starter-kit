import { UserDiToken } from "./user.di";
import { UserService } from "./user.service";


export const userProviders = [
    {
        provide: UserDiToken.USER_SERVICE,
        useClass: UserService,
    },
];
