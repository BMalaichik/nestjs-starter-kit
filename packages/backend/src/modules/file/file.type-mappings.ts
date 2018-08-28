import { File } from "../db";
import { FileDto } from "./dto";
import { TypeMapper } from "../shared";


export function register(mapper: TypeMapper) {
    // File

    mapper.register(File, FileDto, (file: File) => {
        return new FileDto({ ...file });
    });
}
