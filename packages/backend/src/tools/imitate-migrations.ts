import { NestFactory } from "@nestjs/core";

import * as _ from "lodash";
import { readdir } from "fs";
import { Sequelize } from "sequelize";

import { DbModule, DbDiToken } from "../modules/db";


async function bootstrap() {
    const app = await NestFactory.create(DbModule);
    const sequelize: Sequelize = app.get(DbDiToken.SEQUELIZE_CONNECTION);
    const sequelizeMetaTable: string = `sequelize_meta`;

    const migrationFiles: string[] = await (Promise.promisify(readdir)(`${__dirname}/../modules/db/migrations`));
    await sequelize.query(`CREATE TABLE IF NOT EXISTS ${sequelizeMetaTable} (name VARCHAR)`);
    await (sequelize.query(`TRUNCATE TABLE ${sequelizeMetaTable}`));

    const mappedFiles = _.map(migrationFiles, file => `('${file}')`).join(",");

    if (!mappedFiles.length) {
        await sequelize.close();

        return;
    }

    const query = `INSERT INTO sequelize_meta (name) VALUES${mappedFiles};`;

    await sequelize.query(query);
    await sequelize.close();
}

bootstrap();
