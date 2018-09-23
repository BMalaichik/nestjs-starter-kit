import { NestFactory } from "@nestjs/core";

import * as Bluebird from "bluebird";
import { Sequelize } from "sequelize-typescript";

import { ConfigModule, ConfigDiToken } from "../modules/config";


async function bootstrap() {
    const app = await NestFactory.create(ConfigModule);
    const { db } = app.get(ConfigDiToken.CONFIG);
    const sequelize = new Sequelize(db);

    checkConnection(sequelize).then(() => process.exit(0));
}

async function checkConnection(sequelize) {
    try {
        await sequelize.authenticate();
    } catch (err) {
        if (err.message === "the database system is starting up") {
            await Bluebird.delay(1000);
            await checkConnection(sequelize);
        } else {
            console.error(err);
            process.exit(1);
        }
    }
}

bootstrap();
