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

import { ProductDto } from "./product.dto";
import { ProductDiToken } from "./product.di";
import { AuthorizeGuard } from "../../http/guards";
import { ProductService } from "./product.service";


@Controller("/products")
@UseGuards(AuthorizeGuard)
export class ProductController {

    public constructor(
        @Inject(ProductDiToken.PRODUCT_SERVICE) private readonly productService: ProductService,
    ) { }

    @Get("")
    public get(): Promise<ProductDto[]> {
        return this.productService.get();
    }

    @Get("/:id")
    public getById(@Param("id", new ValidationPipe({ transform: true })) id: number): Promise<ProductDto> {
        return this.productService.getById(id);
    }

    @Post("")
    public create(@Body() product: ProductDto): Promise<ProductDto> {
        return this.productService.create(product);
    }

    @Put("/:id")
    public update(@Body() product: ProductDto): Promise<ProductDto> {
        return this.productService.update(product);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete("/:id")
    public delete(@Param("id", new ParseIntPipe()) id: number): Promise<void> {
        return this.productService.delete(id);
    }
}
