import { Module, DynamicModule } from "@nestjs/common";

import { dbProviders } from "./db.providers";
import { ConfigModule, configProviders } from "../config";


@Module({
    imports: [ConfigModule],
    components: [...dbProviders, ...configProviders],
    exports: [...dbProviders],
})
export class DbModule {
    static forRoot(entities = [], options?): DynamicModule {
        const providers = [...dbProviders];

        return {
            module: DbModule,
            components: providers,
            exports: providers,
        };
    }
}
