import {
    Get,
    Post,
    Put,
    Controller,
    Inject,
    Body,
    Param,
    ParseIntPipe,
    Delete,
    UseGuards,
    HttpStatus,
    HttpCode,
    ValidationPipe,
} from "@nestjs/common";

import { CategoryDto } from "./category.dto";
import { CategoryDiToken } from "./category.di";
import { AuthorizeGuard } from "../../http/guards";
import { CategoryService } from "./category.service";


@Controller("/categories")
@UseGuards(AuthorizeGuard)
export class CategoryController {

    public constructor(
        @Inject(CategoryDiToken.CATEGORY_SERVICE) private readonly productService: CategoryService,
    ) { }

    @Get("")
    public get(): Promise<CategoryDto[]> {
        return this.productService.get();
    }

    @Get("/:id")
    public getById(@Param("id", new ValidationPipe({ transform: true })) id: number): Promise<CategoryDto> {
        return this.productService.getById(id);
    }

    @Post("")
    public create(@Body() product: CategoryDto): Promise<CategoryDto> {
        return this.productService.create(product);
    }

    @Put("/:id")
    public update(@Body() product: CategoryDto): Promise<CategoryDto> {
        return this.productService.update(product);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete("/:id")
    public delete(@Param("id", new ParseIntPipe()) id: number): Promise<void> {
        return this.productService.delete(id);
    }
}
