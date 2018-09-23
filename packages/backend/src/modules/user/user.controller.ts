import {
    Get,
    Post,
    Put,
    Query,
    Controller,
    Inject,
    Body,
    Param,
    ParseIntPipe,
    Delete,
    UseGuards,
    HttpStatus,
    HttpCode,
    ValidationPipe,
} from "@nestjs/common";

import { Roles } from "../../http/decorators";
import { UserDto } from "./dto";
import { UserRole } from "../db";
import { UserDiToken } from "./user.di";
import { AuthorizeGuard } from "../../http/guards";
import { UserService, UserStatus } from "./user.service";


@Controller("/user")
@UseGuards(AuthorizeGuard)
export class UserController {

    public constructor(
        @Inject(UserDiToken.USER_SERVICE) private readonly userService: UserService,
    ) { }

    @Get("")
    public get(): Promise<UserDto[]> {
        return this.userService.get();
    }

    @Get("/:id")
    public getById(@Param("id", new ValidationPipe({ transform: true })) id: number): Promise<UserDto> {
        return this.userService.getById(id);
    }

    @Post("")
    public create(@Body() user: UserDto): Promise<UserDto> {
        return this.userService.create(user);
    }

    @Put("/:id")
    public update(@Body() user: UserDto): Promise<UserDto> {
        return this.userService.update(user);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete("/:id")
    public delete(@Param("id", new ParseIntPipe()) id: number): Promise<void> {
        return this.userService.delete(id);
    }

    @Put("/:id/status")
    @Roles(UserRole.ADMIN)
    public setStatus(@Param("id", new ParseIntPipe()) id: number, @Query("value") status: UserStatus): Promise<void> {
        return this.userService.setStatus(id, status);
    }
}
