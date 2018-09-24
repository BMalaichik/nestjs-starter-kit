import { Component, Inject } from "@nestjs/common";

import { CategoryDto } from "./category.dto";
import { BaseService } from "../../base.service";
import { ConfigDiToken, Config } from "../config";
import { EntityNotFoundException } from "../../http/exceptions";
import {Category, DbDiToken} from "../db";
import { TypeMapperDiToken, TypeMapper } from "../shared";

@Component()
export class CategoryService extends BaseService {

    public constructor(
        @Inject(DbDiToken.CATEGORY_REPOSITORY) private readonly repository: typeof Category,
        @Inject(TypeMapperDiToken.MAPPER) private readonly typeMapper: TypeMapper,
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config
    ) {
        super();
    }

    public async get(): Promise<CategoryDto[]> {
        const categories = await this.repository.findAll();
        return categories.map((category: Category) => this.typeMapper.map(Category, CategoryDto, category.toJSON()));
    }

    public async getById(id: number): Promise<CategoryDto> {
        const category: Category = await this.getEntityById(id);

        return this.typeMapper.map(Category, CategoryDto, category);
    }

    public async update(category: CategoryDto): Promise<CategoryDto> {
        await Promise.all([
            super.updateBy(this.repository, Category, category),
        ]);

        return this.typeMapper.map(Category, CategoryDto, await this.getEntityById(category.id));
    }

    public async create(category: CategoryDto): Promise<CategoryDto> {
        const newCategory = await this.repository.create(category);
        return this.typeMapper.map(Category, CategoryDto, newCategory.toJSON());
    }

    public async delete(id: number): Promise<void> {
        const category: Category = await this.repository.findById(id);

        if (!category) {
            throw new EntityNotFoundException("Category", id);
        }

        await category.destroy();
    }

    private async getEntityById(id: number): Promise<Category> {
        const existingCategoryInstance: Category = await this.repository.findById(id);

        if (!existingCategoryInstance) {
            throw new EntityNotFoundException("Category", id);
        }

        return existingCategoryInstance.toJSON();
    }
}
