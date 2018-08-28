import { Module, Global } from "@nestjs/common";

import { loggerProviders } from "./logger.provider";


@Global()
@Module({
    imports: [],
    components: [...loggerProviders],
    exports: [...loggerProviders],
})
export class LoggerModule { }
