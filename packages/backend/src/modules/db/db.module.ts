import { Module, DynamicModule } from "@nestjs/common";

import { dbProviders } from "./db.providers";
import { ConfigModule, configProviders } from "../config";


/**
 *  Data Access Layer wrapping module.
 *  Entities to be added should be located under './entities' folder & relevant providers must be added.
 *  To dynamically add entities: update DbModule.forRoot() function, dynamically configuring providers list.
 */
@Module({
    imports: [ConfigModule],
    providers: [...dbProviders, ...configProviders],
    exports: [...dbProviders],
})
export class DbModule {
    static forRoot(): DynamicModule {
        const providers = [...dbProviders];

        return {
            module: DbModule,
            providers,
            exports: providers,
        };
    }
}
