import { NestFactory } from "@nestjs/core";

import * as Bluebird from "bluebird";
import { Sequelize } from "sequelize-typescript";

import { ConfigModule, ConfigDiToken } from "../modules/config";

let retriesAmount = 0;
const RETRY_LIMIT = 5;
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
        retriesAmount += 1;

        if (retriesAmount < RETRY_LIMIT) {
            await Bluebird.delay(1000);
            await checkConnection(sequelize);
        } else {
            console.error(err);
            process.exit(1);
        }
    }
}

bootstrap();
