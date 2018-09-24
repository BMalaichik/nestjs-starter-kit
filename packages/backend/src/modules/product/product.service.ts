import { Component, Inject } from "@nestjs/common";

import { ProductDto } from "./product.dto";
import { BaseService } from "../../base.service";
import { ConfigDiToken, Config } from "../config";
import { EntityNotFoundException } from "../../http/exceptions";
import {DbDiToken, Product} from "../db";
import { TypeMapperDiToken, TypeMapper } from "../shared";

@Component()
export class ProductService extends BaseService {

    public constructor(
        @Inject(DbDiToken.PRODUCT_REPOSITORY) private readonly repository: typeof Product,
        @Inject(TypeMapperDiToken.MAPPER) private readonly typeMapper: TypeMapper,
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config
    ) {
        super();
    }

    public async get(): Promise<ProductDto[]> {
        const products = await this.repository.findAll();
        return products.map((product: Product) => this.typeMapper.map(Product, ProductDto, product.toJSON()));
    }

    public async getById(id: number): Promise<ProductDto> {
        const product: Product = await this.getEntityById(id);

        return this.typeMapper.map(Product, ProductDto, product);
    }

    public async update(product: ProductDto): Promise<ProductDto> {
        await Promise.all([
            super.updateBy(this.repository, Product, product),
        ]);

        return this.typeMapper.map(Product, ProductDto, await this.getEntityById(product.id));
    }

    public async create(product: ProductDto): Promise<ProductDto> {
        const newProduct = await this.repository.create(product);
        return this.typeMapper.map(Product, ProductDto, newProduct.toJSON());
    }

    public async delete(id: number): Promise<void> {
        const product: Product = await this.repository.findById(id);

        if (!product) {
            throw new EntityNotFoundException("Product", id);
        }

        await product.destroy();
    }

    private async getEntityById(id: number): Promise<Product> {
        const existingProductInstance: Product = await this.repository.findById(id);

        if (!existingProductInstance) {
            throw new EntityNotFoundException("Product", id);
        }

        return existingProductInstance.toJSON();
    }
}
