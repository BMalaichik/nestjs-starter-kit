import { Injectable, Inject } from "@nestjs/common";

import * as uuid from "uuid";
import { S3 } from "aws-sdk";

import { FileType } from "../../db";
import { PermissionContext } from "../../auth";
import { ConfigDiToken, Config } from "../../config";


/**
 *  Incapsulates logic of AWS S3 SDK configuration building.
 *  Refer to [AWS S3 SDK docs](@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)
 */
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
     *  @returns {String} storage path file, only context\type-based. No bucker & filename included.
     */
    public getStoragePath(file: { context: PermissionContext, type: FileType }): string {
        return `${file.type}/`;
    }

    /**
     *  @param {String} path file storing path. Only type-definded part of path
     *  @param {String} originalFilename
     *  @returns {String} File Storage Key
     *  @description Generate Storage File Key - full storage file path, including bucket & generated filename.
     */
    public generateKey(path: string, originalFilename: string): string {
        return `${this.config.storage.prefix}${path}${this.getFilename(originalFilename)}`;
    }

    /**
     *  @param {String} originalFilename
     *  @returns {String} content disposition computed header.
     *  @description Used to store original file name as part of S3 file metadata
     */
    public getContentDisposition(originalFilename: string): string {
        return `attachment; filename*=UTF-8''${encodeURIComponent(originalFilename)}`;
    }

}
