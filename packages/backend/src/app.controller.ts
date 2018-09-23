import { Get, Controller, Inject } from "@nestjs/common";

import { Config, ConfigDiToken } from "./modules/config";


@Controller()
export class AppController {

    public constructor(
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
    ) { }

    @Get()
    async root(): Promise<any> {
        return `Hello world х2!`;
    }
}
