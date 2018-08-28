import {
    HttpCode,
    Inject,
    Controller,
    Body,
    Post,
    UseGuards,
    Delete,
    UseFilters,
} from "@nestjs/common";


import { Public } from "../../http/decorators";
import { AuthService } from "./services";
import { AuthDiToken } from "./auth.di";
import { UserLoginDto } from "./auth.interfaces";
import { AuthorizeGuard } from "../../http/guards";
import { InvalidPasswordExceptionFilter } from "./filters/invalid-password.exception-filter";


@Controller("/auth")
@UseGuards(AuthorizeGuard)
@UseFilters(new InvalidPasswordExceptionFilter())
export class AuthController {

    public constructor(
        @Inject(AuthDiToken.AUTH_SERVICE) private readonly authService: AuthService,
    ) {}

    @HttpCode(200)
    @Post("/login")
    @Public()
    public async getToken(@Body() userInfo: UserLoginDto): Promise<{ token: string }> {
        return this.authService.login(userInfo);
    }

    @HttpCode(200)
    @Delete("/logout")
    public async deleteToken(): Promise<void> {
    }
}
