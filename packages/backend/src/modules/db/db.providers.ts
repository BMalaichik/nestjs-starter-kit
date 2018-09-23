import { Sequelize } from "sequelize-typescript";

import { init } from "./seeder";
import { DbDiToken } from "./db.di";
import { Config, ConfigDiToken } from "../config";
import {
    User,
    Contact,
    File,
    Product
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
        provide: DbDiToken.PRODUCTS_REPOSITORY,
        useValue: Product,
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
                    Product
                ],
            );

            await sequelize.sync({ force: true });
            await init();

            return sequelize;
        },
        inject: [ConfigDiToken.CONFIG],
    },
];
