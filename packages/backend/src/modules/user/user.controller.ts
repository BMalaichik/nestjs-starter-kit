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

import { UserDto } from "./dto";
import { Authorize } from "../auth/decorators";
import { UserDiToken } from "./user.di";
import { AuthorizeGuard } from "../auth/guards";
import { UserService, UserStatus } from "./user.service";
import { RoleWildcard, PermissionName } from "../db";


@Controller("/user")
@UseGuards(AuthorizeGuard)
export class UserController {

    public constructor(
        @Inject(UserDiToken.USER_SERVICE) private readonly userService: UserService,
    ) { }

    @Get("")
    @Authorize({
        [RoleWildcard]: [PermissionName.USER_MANAGEMENT_VIEW],
    })
    public get(): Promise<UserDto[]> {
        return this.userService.get();
    }

    @Get("/:id")
    @Authorize({
        [RoleWildcard]: [PermissionName.USER_MANAGEMENT_VIEW],
    })
    public getById(@Param("id", new ValidationPipe({ transform: true })) id: number): Promise<UserDto> {
        return this.userService.getById(id);
    }

    @Post("")
    @Authorize({
        [RoleWildcard]: [PermissionName.USER_MANAGEMENT_ADD],
    })
    public create(@Body() user: UserDto): Promise<UserDto> {
        return this.userService.create(user);
    }

    @Put("/:id")
    @Authorize({
        [RoleWildcard]: [PermissionName.USER_MANAGEMENT_UPDATE],
    })
    public update(@Body() user: UserDto): Promise<UserDto> {
        return this.userService.update(user);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete("/:id")
    @Authorize({
        [RoleWildcard]: [PermissionName.USER_MANAGEMENT_DELETE],
    })
    public delete(@Param("id", new ParseIntPipe()) id: number): Promise<void> {
        return this.userService.delete(id);
    }

    @Put("/:id/status")
    @Authorize({
        [RoleWildcard]: [PermissionName.USER_MANAGEMENT_UPDATE],
    })
    public setStatus(@Param("id", new ParseIntPipe()) id: number, @Query("value") status: UserStatus): Promise<void> {
        return this.userService.setStatus(id, status);
    }
}
