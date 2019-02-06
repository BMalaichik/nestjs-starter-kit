import { Injectable, Inject } from "@nestjs/common";

import * as _ from "lodash";
import { IFindOptions } from "sequelize-typescript";

import { UserDto } from "./dto";
import { BaseService } from "../../base.service";
import { EntityNotFoundException } from "../../http/exceptions";
import { DbDiToken, Contact, User, Role } from "../db";
import { TypeMapperDiToken, TypeMapper } from "../shared";
import { ContactDiToken, ContactService } from "../contact";
import { ValidatorService, EnumValueValidator } from "../shared/validator";


export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

@Injectable()
export class UserService extends BaseService {

    public constructor(
        @Inject(DbDiToken.USER_REPOSITORY) private readonly repository: typeof User,
        @Inject(ContactDiToken.CONTACT_SERVICE) private readonly contactService: ContactService,
        @Inject(TypeMapperDiToken.MAPPER) private readonly typeMapper: TypeMapper,
    ) {
        super();
    }

    public async get(): Promise<UserDto[]> {
        const findOptions = {
            include: [
                {
                    model: Contact,
                    as: "contact",
                },
                {
                    model: Role,
                    as: "role",
                },
            ],
        };
        const users = await this.repository.findAll(findOptions);

        return _.map(users, (user: User) => this.typeMapper.map(User, UserDto, user.toJSON()));
    }

    public async activate(id: number): Promise<void> {
        await this.updateBy<UserDto>(this.repository, User, { id, isActive: true }, "id", false, ["isActive"]);
    }

    public async updateLoginDate(id: number): Promise<void> {
        await this.updateBy<UserDto>(this.repository, User, { id, lastLogin: new Date() }, "id", false, ["lastLogin"]);
    }

    public async updatePasswordhash(user: { id: number, passwordHash: string }): Promise<void> {
        await this.updateBy<UserDto>(this.repository, User, user, "id", false, ["passwordHash"]);
    }

    public async getById(id: number, includeHash: boolean = false): Promise<UserDto> {
        const findOptions: IFindOptions<User> = {
            include: [
                {
                    model: Contact,
                    as: "contact",
                },
            ],
        };
        const user: User = await this.repository.findById(id, findOptions);

        if (!user) {
            throw new EntityNotFoundException("User", id);
        }

        return this.typeMapper.map(User, UserDto, user, { includeHash });
    }

    public async getByUsername(username: string): Promise<UserDto> {
        const user: User = await this.repository.findOne({
            where: {
                username,
            },
            include: [
                {
                    model: Contact,
                    as: "contact",
                },
                {
                    model: Role,
                    as: "role",
                },
            ],
        });

        if (!user) {
            throw new EntityNotFoundException("User", undefined, "User with specified username not found");
        }

        return this.typeMapper.map(User, UserDto, user, { includeHash: true });
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
                {
                    model: Role,
                    as: "role",
                },
            ],
        });

        if (!user) {
            throw new EntityNotFoundException("User", undefined, "User with specified email not found");
        }

        return this.typeMapper.map(User, UserDto, user, { includeHash: true });
    }

    public async update(user: UserDto): Promise<UserDto> {
        // TODO: add security check if user edits himself!
        await Promise.all([
            super.updateBy(this.repository, User, user),
            this.contactService.update(user.contact),
        ]);

        return this.getById(user.id);
    }

    public async create(user: UserDto): Promise<UserDto> {
        return this.typeMapper.map(User, UserDto, await this.repository.create(user));
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
        ValidatorService.compose([
            new EnumValueValidator(UserStatus, "Status"),
        ])(status);

        const isActive: boolean = status === UserStatus.ACTIVE;
        await this.updateBy<UserDto>(this.repository, User, { id, isActive }, "id", false, ["isActive"]);
    }
}
