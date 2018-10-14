import { Inject, Injectable, ForbiddenException, LoggerService, BadRequestException } from "@nestjs/common";

import * as _ from "lodash";
import * as jwt from "jsonwebtoken";

import { AuthDiToken } from "../auth.di";
import { LoggerDiToken } from "../../logger";
import { PasswordService } from "./password.service";
import { UserRegistrationDto } from "../dto";
import { ConfigDiToken, Config } from "../../config";
import { EmailNotificationService } from "./../../notification/services/email-notification.service";
import { UserLoginDto, JwtUserData, ResendInviteDto, ResetPasswordDto } from "../auth.interfaces";
import { UserRegistrationException } from "../exceptions/user-registration-exception";
import { UserDiToken, UserService, UserDto } from "../../user";
import { EmailPayload, NotificationDiToken } from "../../notification";
import { getFullNameSafe, ContactDto, ContactService, ContactDiToken } from "../../contact";
import { ValidatorService, NotEmptyValidator, ValidationError } from "../../shared/validator";
import { UserUpdatePasswordDto } from "../../user/dto";
import { CurrentUserService } from "./current-user.service";


@Injectable()
export class AuthService {
    public static SECRET: string;

    public constructor(
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
        @Inject(UserDiToken.USER_SERVICE) private readonly userService: UserService,
        @Inject(LoggerDiToken.LOGGER) private readonly logger: LoggerService,
        @Inject(AuthDiToken.PASSWORD_SERVICE) private readonly passwordService: PasswordService,
        @Inject(ContactDiToken.CONTACT_SERVICE) private readonly contactService: ContactService,
        @Inject(NotificationDiToken.EMAIL_NOTIFICATION_SERVICE) private readonly emailNotificationService: EmailNotificationService,
        @Inject(AuthDiToken.CURRENT_USER_SERVICE) private readonly currentUserService: CurrentUserService,
    ) {
        AuthService.SECRET = this.config.auth.tokenSecret;

        if (!AuthService.SECRET) {
            throw new Error(`No token secret specified in the configuration`);
        }
    }

    public async updatePassword(id: number, data: UserUpdatePasswordDto): Promise<void> {
        const errors: ValidationError[] = ValidatorService.compose([
            new NotEmptyValidator("New Pasword", "newPassword"),
            new NotEmptyValidator("Old Pasword", "newPassword"),
        ], [], { failOnError: false })(data) as ValidationError[];

        if (!_.isEmpty(errors)) {
            throw new ForbiddenException(errors.join("\n"));
        }

        const user: JwtUserData = this.currentUserService.get();
        // check if user edits himself
        if (!user || user.id !== id) {
            throw new ForbiddenException();
        }

        const userDto: UserDto = await this.userService.getById(id, true);
        await this.passwordService.verify(data.oldPassword, userDto.passwordHash);
        const newPasswordHash: string = await this.passwordService.hash(data.newPassword);
        await this.userService.updatePasswordhash({ id, passwordHash: newPasswordHash });
    }

    public async verifyResetPassword(token: string): Promise<void> {
        let payload: { userId: number };
        try {
            payload = jwt.verify(token , this.config.auth.resetPasswordTokenSecret) as any;
        } catch (err) {
            throw new ForbiddenException();
        }

        const existingUser: UserDto = await this.userService.getById(payload.userId); // checks if user exists
        const userPassword: string = await this.passwordService.generate();
        const passwordHash: string = await this.passwordService.hash(userPassword);
        const userToUpdate: UserDto = _.assign({}, existingUser, { passwordHash });

        await this.userService.updatePasswordhash(userToUpdate as any);

        const emailPayload: EmailPayload = {
            to: existingUser.contact.email,
            subject: `Application Platform Password Reset`,
            text: `
                Your password has been reset.
                Your new password is:${userPassword}
            `,
        };

        return this.emailNotificationService.notify(emailPayload);
    }

    public async sendResetPasswordEmail(data: ResetPasswordDto): Promise<void> {
        const user: UserDto = await this.getUserByEmailOrUsername(data);
        const resetPasswordToken = this.createResetPasswordToken(user);
        const emailPayload: EmailPayload = {
            to: user.contact.email,
            subject: `Application Platform Password Reset`,
            text: `
                To confirm password recovery, please, follow link:
                ${this.config.app.url}?token=${resetPasswordToken}
            `,
        };

        return this.emailNotificationService.notify(emailPayload);
    }

    public async register(user: UserRegistrationDto): Promise<UserDto> {
        ValidatorService.compose([
            new NotEmptyValidator("Email", "contact.email"),
            new NotEmptyValidator("Date of Birth", "contact.dateOfBirth"),
        ])(user) as ValidationError[];

        // TODO: move nested objects validation to schem-validator, validate request: password is strong

        const passwordHash: string = await this.passwordService.hash(user.password);
        const contact: ContactDto = await this.contactService.create(user.contact);
        const userToCreate = _.assign(
            {},
            _.pick(user, ["publicPlacementAgreed", "username", "role"]),
            {  isActive: false, passwordHash, contactId: contact.id },
        );
        const createdUser: UserDto = _.assign({}, await this.userService.create(userToCreate as any), { contact });

        await this.sendInviteEmail(createdUser);

        return _.omit(createdUser, "passwordHash") as UserDto;
    }

    public async login(userInfo: UserLoginDto): Promise<{ token: string }> {
        let user: UserDto;

        try {
            user = await this.userService.getByUsername(userInfo.username);
        } catch (err) {
            this.logger.error(err);
            throw new ForbiddenException();
        }

        await this.passwordService.verify(userInfo.password, user.passwordHash);

        const token: string = await this.createAuthToken(user, userInfo.rememberMe);

        this.userService.updateLoginDate(user.id); // no need to wait for update completion

        return { token };
    }

    public async verifyInvite(token: string): Promise<void> {
        if (!token) {
            throw new ForbiddenException();
        }

        let payload: { userId: number };
        try {
            payload = jwt.verify(token , this.config.auth.inviteTokenSecret) as any;
        } catch (err) {
            throw new ForbiddenException();
        }

        await this.userService.activate(payload.userId);
    }

    public async resendInviteEmail(data: ResendInviteDto): Promise<void> {
        const user: UserDto = await this.getUserByEmailOrUsername(data);

        if (user.isActive) {
            throw new ForbiddenException(`User is already verified`);
        }

        await this.sendInviteEmail(user);
    }

    private async sendInviteEmail(user: UserDto): Promise<void> {
        const token = this.createInviteToken(user);
        const payload: EmailPayload = {
            to: user.contact.email,
            subject: `Registration confirmation`,
            text: `
                Your account has been successfully created! To confirm registration, please, follow link:
                ${this.config.app.url}?token=${token}
            `,
        };

        await this.emailNotificationService.notify(payload);
    }

    private createAuthToken(user: UserDto, rememberMe?: boolean): string {
        const tokenExpiration = rememberMe ? this.config.auth.longTokenExpiration : this.config.auth.tokenExpiration;
        const userFullName: string = getFullNameSafe(user.contact.firstName, user.contact.lastName);
        const payload: JwtUserData = {
            id: user.id,
            name: userFullName,
            email: user.contact.email,
            roles: [user.role],
        };

        return this.generateToken(payload, { expiresIn: tokenExpiration, secret: this.config.auth.tokenSecret });
    }

    private createInviteToken(user: UserDto): string {
        const inviteTokenPayload = { userId: user.id };
        const { inviteTokenExpiration, inviteTokenSecret } = this.config.auth;

        return this.generateToken(inviteTokenPayload, { expiresIn: inviteTokenExpiration, secret: inviteTokenSecret });
    }

    private createResetPasswordToken(user: UserDto): string {
        const inviteTokenPayload = { userId: user.id };
        const { resetPasswordTokenExpiration, resetPasswordTokenSecret } = this.config.auth;

        return this.generateToken(inviteTokenPayload, { expiresIn: resetPasswordTokenExpiration, secret: resetPasswordTokenSecret });
    }

    private generateToken(payload: any, opts: { expiresIn: number | string, secret: string }): string {
        return jwt.sign(payload, opts.secret, { expiresIn: opts.expiresIn });
    }

    private async getUserByEmailOrUsername(data: { username?: string; email?: string }): Promise<UserDto> {
        if (_.isEmpty(data)) {
            throw new BadRequestException(`username of email must be provided`);
        }

        let user: UserDto;

        try {
            user = data.username ? await this.userService.getByUsername(data.username) : await this.userService.getByEmail(data.email);
        } catch (err) {
            this.logger.error(err);
            // avoiding exposing any internal error
            throw new ForbiddenException();
        }

        return user;
    }
}
