import { Module, NestModule, MiddlewaresConsumer, forwardRef, Inject } from "@nestjs/common";

import { DbModule } from "../db";
import { AuthModule } from "../auth";
import { ConfigModule } from "../config";
import { ProductController } from "./product.controller";
import { register as registerTypeMappings } from "./product.type-mappings";
import { SharedModule, TypeMapperDiToken, TypeMapper } from "../shared";
import {ProductDiToken} from "./product.di";
import {ProductService} from "./product.service";

const productProviders = [
    {
        provide: ProductDiToken.PRODUCT_SERVICE,
        useClass: ProductService,
    },
];

@Module({
    imports: [
        DbModule,
        forwardRef(() => AuthModule),
        SharedModule,
        ConfigModule,
    ],
    controllers: [ProductController],
    components: [...productProviders],
    exports: [...productProviders],
})
export class ProductModule implements NestModule {
    public constructor(
        @Inject(TypeMapperDiToken.MAPPER) private readonly mapper: TypeMapper,
    ) {
        registerTypeMappings(mapper);
    }

    public configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {

    }
}
