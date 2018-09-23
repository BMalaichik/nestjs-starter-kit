import { Module, Global } from "@nestjs/common";

import { ConfigModule } from "../config";
import { loggerProviders } from "./logger.provider";


@Global()
@Module({
    imports: [ConfigModule],
    providers: [...loggerProviders],
    exports: [...loggerProviders],
})
export class LoggerModule { }
