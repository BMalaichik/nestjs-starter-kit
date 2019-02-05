import { Sequelize } from "sequelize-typescript";

import { DbDiToken } from "./db.di";
import { Config, ConfigDiToken } from "../config";
import {
    User,
    Contact,
    File,
    TimeBasedEvent,
    Role,
    RolePermission,
    Permission,
    UserActivity,
} from "./entities";


const repositoryProviders = [
    {
        provide: DbDiToken.USER_REPOSITORY,
        useValue: User,
    },
    {
        provide: DbDiToken.USER_ACTIVITY_REPOSITORY,
        useValue: UserActivity,
    },
    {
        provide: DbDiToken.ROLE_REPOSITORY,
        useValue: Role,
    },
    {
        provide: DbDiToken.PERMISSION_REPOSITORY,
        useValue: Permission,
    },
    {
        provide: DbDiToken.ROLE_PERMISSION_REPOSITORY,
        useValue: RolePermission,
    },
    {
        provide: DbDiToken.CONTACT_REPOSITORY,
        useValue: Contact,
    },
    {
        provide: DbDiToken.FILE_REPOSITORY,
        useValue: File,
    },
    {
        provide: DbDiToken.TIME_BASED_EVENT_REPOSITORY,
        useValue: TimeBasedEvent,
    },
];
/**
 * Models need to be re-exported to be handled by other db consumers (e.g. cli scripts)
 */
export const models = [
    Role,
    Permission,
    RolePermission,
    Contact,
    User,
    UserActivity,
    File,
    TimeBasedEvent,
];
export const dbProviders = [
    ...repositoryProviders,
    {
        provide: DbDiToken.SEQUELIZE_CONNECTION,
        useFactory: async (config: Config) => {
            const sequelize = new Sequelize(config.db as any);
            sequelize.addModels(models);

            await sequelize.sync();

            return sequelize;
        },
        inject: [ConfigDiToken.CONFIG],
    },
];
