import { Module, DynamicModule } from "@nestjs/common";

import { dbProviders } from "./db.providers";
import { ConfigModule, configProviders } from "../config";


@Module({
    imports: [ConfigModule],
    providers: [...dbProviders, ...configProviders],
    exports: [...dbProviders],
})
export class DbModule {
    static forRoot(entities = [], options?): DynamicModule {
        const providers = [...dbProviders];

        return {
            module: DbModule,
            providers,
            exports: providers,
        };
    }
}
