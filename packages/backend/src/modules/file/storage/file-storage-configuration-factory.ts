import { Injectable, Inject } from "@nestjs/common";

import * as uuid from "uuid";
import { S3 } from "aws-sdk";

import { FileType } from "../../db";
import { PermissionContext } from "../../auth";
import { ConfigDiToken, Config } from "../../config";


@Injectable()
export class S3FileStorageConfigurationFactory {

    public constructor(
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
    ) {

    }
    public getDeleteConfiguration(key: string): S3.DeleteObjectRequest {
        return {
            Bucket: this.config.storage.bucket,
            Key: key,
        };
    }

    public getMultipleDeleteConfiguration(keys: string[]): S3.DeleteObjectsRequest {
        return {
            Bucket: this.config.storage.bucket,
            Delete: {
                Objects: keys.map((key: string) => {
                    return { Key: key };
                }),
            },
        };
    }

    public getUploadConfiguration(key: string, body: any, originalName: string): S3.PutObjectRequest {
        return {
            Bucket: this.config.storage.bucket,
            Key: key,
            Body: body,
            ContentDisposition: this.getContentDisposition(originalName),
        };
    }

    public getDownloadConfiguration(key: string): S3.GetObjectRequest {
        return {
            Bucket: this.config.storage.bucket,
            Key: key,
        } as S3.Types.GetObjectRequest;
    }

    /**
     *  Returns new storage filename to prevent collisions
     */
    public getFilename(originalFilename: string): string {
        return `${uuid.v4()}_${originalFilename}`;
    }

    /**
     *
     *  Returns storage path: doesn't include filename & upload prefix
     */
    public getStoragePath(file: { context: PermissionContext, type: FileType }): string {
        return `${file.type}/`;
    }

    /**
     *  Returns storage key: full bucket path
     */
    public getKey(path: string, originalFilename: string): string {
        return `${this.config.storage.prefix}${path}${this.getFilename(originalFilename)}`;
    }

    public getContentDisposition(originalFilename: string): string {
        return `attachment; filename*=UTF-8''${encodeURIComponent(originalFilename)}`;
    }

}
