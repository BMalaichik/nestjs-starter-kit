import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { typeMapperProviders } from "./type-mapper.providers";

/**
 *  Provides API for module-independent callback-based type mappings.
 *  Problem: We have various view models\dto's which we need to map cross-modules.
 *  Services become overloaded with type-mappings stuff, you need to map objects as part dependencies of other modules objects.
 *  This module allow you to encapsulate mapping logic & share accross application, reducing extra dependencies & mapping classes creation.
 *  How to use:
 *  1. import module
 *  2. create file `module.type-mappings.ts`
 *  3. follow mapping example from {@link UserModule}
 *  4. import {@link TypeMapper} & call method `map`, providing source & target classes
 */
@Module({
    imports: [],
    providers: [...typeMapperProviders],
    exports: [...typeMapperProviders],
})
export class TypeMapperModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {

    }
}
