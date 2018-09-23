import { Sequelize } from "sequelize-typescript";

import { DbDiToken } from "./db.di";
import { Config, ConfigDiToken } from "../config";
import {
    User,
    Contact,
    File,
    TimeBasedEvent,
} from "./entities";


const repositoryProviders = [
    {
        provide: DbDiToken.USER_REPOSITORY,
        useValue: User,
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

export const dbProviders = [
    ...repositoryProviders,
    {
        provide: DbDiToken.SEQUELIZE_CONNECTION,
        useFactory: async (config: Config) => {
            const sequelize = new Sequelize(config.db);
            sequelize.addModels(
                [
                    Contact,
                    User,
                    File,
                    TimeBasedEvent,
                ],
            );

            await sequelize.sync();

            return sequelize;
        },
        inject: [ConfigDiToken.CONFIG],
    },
];
