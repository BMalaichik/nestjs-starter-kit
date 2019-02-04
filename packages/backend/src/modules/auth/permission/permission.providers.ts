import { PermissionDiToken } from "./permission.di";
import { PermissionService } from "./services";


export const permissionProviders = [
    {
        provide: PermissionDiToken.PERMISSION_SERVICE,
        useClass: PermissionService,
    },
];
