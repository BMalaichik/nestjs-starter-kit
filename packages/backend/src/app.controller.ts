import { Get, Controller, Inject } from "@nestjs/common";

import { Config, ConfigDiToken } from "./modules/config";
import { DbDiToken } from "./modules/db/db.di";
import { ValidatorService } from "./modules/shared/validator";
import { NotNilValidator, NotEmptyValidator, SampleAsynclValidator } from "./modules/shared/validator/base";


@Controller()
export class AppControllerXXXXXX {

    public constructor(
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
    ) { }

    @Get()
    async root(): Promise<any> {
        return `Hello world х2!`;
    }
}
