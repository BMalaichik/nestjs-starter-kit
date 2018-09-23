import { ProductDto } from "./product.dto";
import { TypeMapper } from "../shared";
import { Product } from "../db";


export function register(mapper: TypeMapper) {
    mapper.register(Product, ProductDto, (product: Product) => {
        return new ProductDto({ ...product });
    });
}
