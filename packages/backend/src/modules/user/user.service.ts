import * as _ from "lodash";
import { Component, Inject } from "@nestjs/common";
import { IFindOptions } from "sequelize-typescript";

import { UserDto } from "./user.dto";
import { BaseService } from "../../base.service";
import { AuthDiToken } from "../auth";
import { PasswordService } from "../auth";
import { ConfigDiToken, Config } from "../config";
import { EntityNotFoundException } from "../../http/exceptions";
import { DbDiToken, Contact, User } from "../db";
import { InvalidUserStatusException } from "./exceptions";
import { TypeMapperDiToken, TypeMapper } from "../shared";
import { ContactDiToken, ContactService, ContactDto } from "../contact";
import { EmailNotificationService, NotificationDiToken, EmailPayload } from "../notification";


export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

@Component()
export class UserService extends BaseService {

    public constructor(
        @Inject(DbDiToken.USER_REPOSITORY) private readonly repository: typeof User,
        @Inject(ContactDiToken.CONTACT_SERVICE) private readonly contactService: ContactService,
        @Inject(TypeMapperDiToken.MAPPER) private readonly typeMapper: TypeMapper,
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
        @Inject(NotificationDiToken.EMAIL_NOTIFICATION_SERVICE) private readonly emailNotificationService: EmailNotificationService,
        @Inject(AuthDiToken.PASSWORD_SERVICE) private readonly passwordService: PasswordService,
    ) {
        super();
    }

    public async get(): Promise<UserDto[]> {
        const findOptions = {
            include: [
                {
                    model: Contact,
                    as: "contact",
                }
            ],
        };
        const users = await this.repository.findAll(findOptions);

        return _.map(users, (user: User) => this.typeMapper.map(User, UserDto, user.toJSON()));
    }

    public async getById(id: number): Promise<UserDto> {
        const user: User = await this.getEntityById(id);

        return this.typeMapper.map(User, UserDto, user);
    }

    public async getByEmail(email: string): Promise<UserDto> {
        const user: User = await this.repository.findOne({
            include: [
                {
                    model: Contact,
                    as: "contact",
                    where: {
                        email,
                    },
                },
            ],
        });

        if (!user) {
            throw new EntityNotFoundException("User", undefined, "User with specified email not found");
        }

        return this.typeMapper.map(User, UserDto, user.toJSON(), { includeHash: true });
    }

    public async update(user: UserDto): Promise<UserDto> {
        await Promise.all([
            super.updateBy(this.repository, User, user),
            this.contactService.update(user.contact),
        ]);

        return this.typeMapper.map(User, UserDto, await this.getEntityById(user.id));
    }

    public async create(user: UserDto): Promise<UserDto> {
        const userPassword: string = await this.passwordService.generate();
        const passwordHash: string = await this.passwordService.hash(userPassword);

        const contact: ContactDto = await this.contactService.create(user.contact);
        const userToCreate: UserDto = _.assign({}, user, { passwordHash, contactId: contact.id });
        const createdUser: UserDto = _.assign(
            this.typeMapper.map(User, UserDto, (await this.repository.create(userToCreate)).toJSON()),
            { contact },
        );
        const payload: EmailPayload = {
            to: this.config.app.adminEmail,
            subject: `Application Platform User registration`,
            text: `
                New User ${contact.firstName} ${contact.lastName} has been successfully created!
                Login: ${createdUser.contact.email}
                Password: ${userPassword}
            `,
        };

        await this.emailNotificationService.notify(payload);

        return createdUser;
    }

    public async delete(id: number): Promise<void> {
        const user: User = await this.repository.findById(id);

        if (!user) {
            throw new EntityNotFoundException("User", id);
        }

        await user.destroy();
        await this.contactService.delete(user.contactId);
    }

    public async setStatus(id: number, status: UserStatus): Promise<void> {
        if (!_.includes(_.values(UserStatus), status)) {
            throw new InvalidUserStatusException();
        }

        const isActive: boolean = status === UserStatus.ACTIVE;
        const [amountOfUpdatedUsers] = await this.repository.update({ isActive }, { limit: 1, where: { id } });

        if (amountOfUpdatedUsers !== 1) {
            throw new EntityNotFoundException("User", id);
        }
    }

    private async getEntityById(id: number): Promise<User> {
        const findOptions: IFindOptions<User> = {
            include: [
                {
                    model: Contact,
                    as: "contact",
                },
            ],
        };
        const existingUserInstance: User = await this.repository.findById(id, findOptions);

        if (!existingUserInstance) {
            throw new EntityNotFoundException("User", id);
        }

        return existingUserInstance.toJSON();
    }
}
