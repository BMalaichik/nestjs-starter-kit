import { S3 } from "aws-sdk";
import { Injectable, Inject } from "@nestjs/common";

import { FileDiToken } from "../file.di";


@Injectable()
export class S3FileStorage {

    public constructor(
        @Inject(FileDiToken.S3) private readonly s3: S3,
    ) {}

    public upload(config: S3.PutObjectRequest): Promise<S3.PutObjectOutput> {
        return this.s3.upload(config).promise();
    }

    public delete(config: S3.DeleteObjectRequest): Promise<S3.DeleteObjectOutput> {
        return this.s3.deleteObject(config).promise();
    }

    public multipleDelete(config: S3.DeleteObjectsRequest): Promise<S3.DeleteObjectsOutput> {
        return this.s3.deleteObjects(config).promise();
    }

    public getDirectUrl(config: S3.Types.GetObjectRequest): string {
        return this.s3.getSignedUrl("getObject", config);
    }
}
