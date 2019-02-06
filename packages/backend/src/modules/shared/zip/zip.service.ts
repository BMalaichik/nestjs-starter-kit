import "bluebird-global";
import { Injectable, BadRequestException } from "@nestjs/common";

import * as _ from "lodash";
import { Archive } from "./acrhive";


const MAX_FILE_AMOUNT = 10;
export type ArchiveDataRequest = { data: Buffer, name: string }[];

@Injectable()
export class ZipService {

    public async get(request: ArchiveDataRequest): Promise<Buffer> {
        const archive = new Archive();

        await this.validateRequest(request as any);
        await Promise.map(
            request,
            (file: { data: Buffer, name: string }) => {
                archive.append(file.name, file.data);
            },
            { concurrency: 10 },
        );

        return archive.generate();
    }

    private async validateRequest(request: ArchiveDataRequest): Promise<void> {
        if (_.isEmpty(request)) {
            throw new BadRequestException("Empty zip files request");
        }

        if (request.length > MAX_FILE_AMOUNT) {
            const msg: string = `File archive request size exceeded size ${MAX_FILE_AMOUNT}, number of requested files: ${request.length}`;

            throw new BadRequestException(msg);
        }
    }
}
