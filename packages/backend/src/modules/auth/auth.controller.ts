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
} from "@nestjs/common";


import { Public } from "../../http/decorators";
import { UserDto } from "../user";
import { AuthService } from "./services";
import { AuthDiToken } from "./auth.di";
import { AuthorizeGuard } from "../../http/guards";
import { UserRegistrationDto } from "./dto";
import { UserUpdatePasswordDto } from "../user/dto";
import { ValidationExceptionFilter } from "../../http/filters";
import { InvalidPasswordExceptionFilter } from "./filters/invalid-password.exception-filter";
import { UserLoginDto, ResendInviteDto, ResetPasswordDto } from "./auth.interfaces";


@Controller("/auth")
@UseGuards(AuthorizeGuard)
@UseFilters(InvalidPasswordExceptionFilter, ValidationExceptionFilter)
export class AuthController {

    public constructor(
        @Inject(AuthDiToken.AUTH_SERVICE) private readonly authService: AuthService,
    ) {}

    @HttpCode(200)
    @Post("/login")
    @Public()
    public async login(@Body() userInfo: UserLoginDto): Promise<{ token: string }> {
        return this.authService.login(userInfo);
    }

    @HttpCode(200)
    @Post("/invite/verify")
    @Public()
    public async verifyInvite(@Body("token") token: string): Promise<void> {
        return this.authService.verifyInvite(token);
    }

    @HttpCode(200)
    @Post("/invite/resend")
    @Public()
    public async resendInvite(@Body() data: ResendInviteDto): Promise<void> {
        return this.authService.resendInviteEmail(data);
    }

    @HttpCode(200)
    @Post("/register")
    @Public()
    public async register(@Body(new ValidationPipe({ transform: true })) data: UserRegistrationDto): Promise<UserDto> {
        return this.authService.register(data);
    }

    @HttpCode(200)
    @Post("/password/reset")
    @Public()
    public async resetPassword(@Body() data: ResetPasswordDto): Promise<void> {
        return this.authService.sendResetPasswordEmail(data);
    }

    @HttpCode(200)
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
