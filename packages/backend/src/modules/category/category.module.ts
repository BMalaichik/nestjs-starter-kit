import { Module, NestModule, MiddlewaresConsumer, forwardRef, Inject } from "@nestjs/common";

import { DbModule } from "../db";
import { AuthModule } from "../auth";
import { ConfigModule } from "../config";
import { CategoryController } from "./category.controller";
import { register as registerTypeMappings } from "./category.type-mappings";
import { SharedModule, TypeMapperDiToken, TypeMapper } from "../shared";
import {CategoryDiToken} from "./category.di";
import {CategoryService} from "./category.service";

const categoryProviders = [
    {
        provide: CategoryDiToken.CATEGORY_SERVICE,
        useClass: CategoryService,
    },
];

@Module({
    imports: [
        DbModule,
        forwardRef(() => AuthModule),
        SharedModule,
        ConfigModule,
    ],
    controllers: [CategoryController],
    components: [...categoryProviders],
    exports: [...categoryProviders],
})
export class CategoryModule implements NestModule {
    public constructor(
        @Inject(TypeMapperDiToken.MAPPER) private readonly mapper: TypeMapper,
    ) {
        registerTypeMappings(mapper);
    }

    public configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {

    }
}
