import { AuthDiToken } from "./auth.di";
import { PasswordService, AuthService, PermissionService, CurrentUserService } from "./services";


export const authProviders = [
    {
        provide: AuthDiToken.AUTH_SERVICE,
        useClass: AuthService,
    },
    {
        provide: AuthDiToken.PASSWORD_SERVICE,
        useClass: PasswordService,
    },
    {
        provide: AuthDiToken.CURRENT_USER_SERVICE,
        useClass: CurrentUserService,
    },
    {
        provide: AuthDiToken.PERMISSION_SERVICE,
        useClass: PermissionService,
    },
];
