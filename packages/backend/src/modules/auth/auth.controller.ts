import {
    HttpCode,
    Inject,
    Controller,
    Body,
    Post,
    UseGuards,
    UseFilters,
    Put,
    Param,
    ParseIntPipe,
    ValidationPipe,
    Get,
    HttpStatus,
} from "@nestjs/common";


import { UserDto } from "../user";
import { AuthDiToken } from "./auth.di";
import { RoleWildcard } from "../db";
import { Authorize, Public } from "./decorators";
import { UserUpdatePasswordDto } from "../user/dto";
import { ValidationExceptionFilter } from "../../http/filters";
import { InvalidPasswordExceptionFilter } from "./filters/invalid-password.exception-filter";
import { AuthService, CurrentUserService } from "./services";
import { AuthorizeGuard, PermissionWildcard } from "./guards";
import { PermissionService, PermissionDiToken } from "./permission";
import { UserLoginDto, ResendInviteDto, ResetPasswordDto } from "./auth.interfaces";
import { UserRegistrationDto, RoleDto, AclDto, AclDashboardDto, RolePermissionDto } from "./dto";


@Controller("/auth")
@UseGuards(AuthorizeGuard)
@UseFilters(InvalidPasswordExceptionFilter, ValidationExceptionFilter)
export class AuthController {

    public constructor(
        @Inject(AuthDiToken.AUTH_SERVICE) private readonly authService: AuthService,
        @Inject(AuthDiToken.CURRENT_USER_SERVICE) private readonly currentUserService: CurrentUserService,
        @Inject(PermissionDiToken.PERMISSION_SERVICE) private readonly permissionService: PermissionService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post("/login")
    @Public()
    public async login(@Body() userInfo: UserLoginDto): Promise<{ token: string }> {
        return this.authService.login(userInfo);
    }

    @HttpCode(HttpStatus.OK)
    @Post("/invite/verify")
    @Public()
    public async verifyInvite(@Body("token") token: string): Promise<void> {
        return this.authService.verifyInvite(token);
    }

    @Get("/role")
    public async getRoles(): Promise<RoleDto[]> {
        return this.authService.getRoles();
    }

    @HttpCode(HttpStatus.OK)
    @Get("/acl")
    @Authorize({ [RoleWildcard]: PermissionWildcard })
    public async getACL(): Promise<AclDto> {
        return this.permissionService.getACL(this.currentUserService.get());
    }

    @HttpCode(HttpStatus.OK)
    @Get("/acl/dashboard")
    @Authorize()
    public async getRolesACLDashboard(): Promise<AclDashboardDto> {
        return this.permissionService.getACLDashboard();
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Put("/acl")
    @Authorize()
    public async updateRolePermission(@Body() data: RolePermissionDto): Promise<void> {
        return this.permissionService.updateRolePermission(data);
    }


    @HttpCode(HttpStatus.OK)
    @Post("/invite/resend")
    @Public()
    public async resendInvite(@Body() data: ResendInviteDto): Promise<void> {
        return this.authService.resendInviteEmail(data);
    }

    @HttpCode(HttpStatus.OK)
    @Post("/register")
    @Public()
    public async register(@Body(new ValidationPipe({ transform: true })) data: UserRegistrationDto): Promise<UserDto> {
        return this.authService.register(data);
    }

    @HttpCode(HttpStatus.OK)
    @Post("/password/reset")
    @Public()
    public async resetPassword(@Body() data: ResetPasswordDto): Promise<void> {
        return this.authService.sendResetPasswordEmail(data);
    }

    @HttpCode(HttpStatus.OK)
    @Post("/password/reset/verify")
    @Public()
    public async verifyResetPassword(@Body("token") token: string): Promise<void> {
        return this.authService.verifyResetPassword(token);
    }

    @Put("/user/:id/password")
    public updatePassword(
        @Body() data: UserUpdatePasswordDto,
        @Param("id", new ParseIntPipe()) id: number,
    ): Promise<void> {
        return this.authService.updatePassword(id, data);
    }
}
