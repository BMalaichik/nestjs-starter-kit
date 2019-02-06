import { NestFactory } from "@nestjs/core";

import * as _ from "lodash";
import { Sequelize } from "sequelize-typescript";

import { models } from "../modules/db";
import { ConfigModule, ConfigDiToken } from "../modules/config";


/**
 *  ATTENTION!
 *  Dangerous. Connection db data would be COMPLETELY LOST.
 */
async function bootstrap() {
    console.log("I hope you know what you are doing ...");

    const app = await NestFactory.create(ConfigModule);
    const { db } = app.get(ConfigDiToken.CONFIG);
    const sequelize: Sequelize = new Sequelize(db);
    sequelize.addModels(models);

    await sequelize.sync({ force: true });

    require("./imitate-migrations");

    await sequelize.close();
}

bootstrap();
