import {
    Controller,
    UseGuards,
    UseFilters,
    Post,
    UseInterceptors,
    FileInterceptor,
    UploadedFile,
    Inject,
    Body,
    Delete,
    Param,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";

import { FileService } from "./services/file.service";
import { FileDiToken } from "./file.di";
import { AuthorizeGuard } from "../../http/guards";
import { CurrentUserNotDefinedExceptionFilter } from "../auth/filters";


@Controller("/file")
@UseGuards(AuthorizeGuard)
@UseFilters(new CurrentUserNotDefinedExceptionFilter())
export class FileController {

    public constructor(
        @Inject(FileDiToken.FILE_SERVICE) private readonly fileService: FileService,
    ) {}

    @Post("/upload")
    @UseInterceptors(FileInterceptor("file"))
    public async upload(
        @UploadedFile() uploadedFile: any,
        @Body("params") params: string,
    ): Promise<any> {
        return this.fileService.upload({ data: uploadedFile, file: JSON.parse(params) });
    }

    @Delete("/:ids")
    @HttpCode(HttpStatus.NO_CONTENT)
    public async multipleDelete(@Param("ids") ids: string): Promise<void> {
        const parsedIds: number[] = ids.split(",").map(i => +i);

        return this.fileService.multipleDelete(parsedIds);
    }
}
