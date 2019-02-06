import { AuthDiToken } from "./auth.di";
import { PasswordService, AuthService, PermissionContextService, CurrentUserService } from "./services";


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
        provide: AuthDiToken.PERMISSION_CONTEXT_SERVICE,
        useClass: PermissionContextService,
    },
];
