import { CategoryDto } from "./category.dto";
import { TypeMapper } from "../shared";
import { Category } from "../db";


export function register(mapper: TypeMapper) {
    mapper.register(Category, CategoryDto, (category: Category) => {
        return new CategoryDto({ ...category });
    });
}
