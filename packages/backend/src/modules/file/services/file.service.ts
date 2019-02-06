import { Injectable, Inject, ForbiddenException } from "@nestjs/common";

import * as _ from "lodash";
import { ReadStream } from "fs";
import { PassThrough } from "stream";
import { IFindOptions } from "sequelize-typescript";
import { WhereOptions, Op } from "sequelize";

import { FileDto } from "../dto";
import { BaseService } from "../../../base.service";
import { FileDiToken } from "../file.di";
import { S3FileStorage } from "../storage/file-storage";
import { DbDiToken, File, FileType } from "../../db";
import { TypeMapperDiToken, TypeMapper } from "../../shared";
import { S3FileStorageConfigurationFactory } from "../storage";
import { ValidatorService, NotNilValidator, EnumValueValidator, NotEmptyValidator } from "../../shared/validator";
import {
    JwtUserData,
    AuthDiToken,
    PermissionContext,
    CurrentUserService,
    PermissionContextService,
    CurrentUserNotDefinedException,
} from "../../auth";


export interface FileUploadRequestModel {
    data: { originalname: string; buffer: Buffer | ReadableStream };
    file: FileParams;
}

export interface FileParams {
    title: string;
    name?: string;
    type: FileType;
    description?: string;
    dealId: number;
}

/**
 *  Abstractaion layer of in-system file representation manipulations.
 *  Files are assumed to be presented in `file` table.
 *  FileDto - in-system file representation.
 */
@Injectable()
export class FileService extends BaseService {

    public constructor(
        @Inject(FileDiToken.FILE_STORAGE) private readonly storage: S3FileStorage,
        @Inject(FileDiToken.FILE_STORAGE_CONFIGURATION_FACTORY) private readonly configFactory: S3FileStorageConfigurationFactory,
        @Inject(DbDiToken.FILE_REPOSITORY) private readonly repository: typeof File,
        @Inject(AuthDiToken.CURRENT_USER_SERVICE) private readonly currentUserService: CurrentUserService,
        @Inject(AuthDiToken.PERMISSION_CONTEXT_SERVICE) private readonly permissionService: PermissionContextService,
        @Inject(TypeMapperDiToken.MAPPER) private readonly typeMapper: TypeMapper,
    ) {
        super();
    }


    /**
     * @param {ReadStream} readStream  input stream to be piped to the storage
     * @param {FileParams} params
     * @returns {FileDto} in-system file representation
     * @description Method reads from input stream & pipe output to the S3 Storage
     */
    public async multipartUpload(readStream: ReadStream, params: FileParams): Promise<FileDto> {
        const passTransformStream = new PassThrough();
        const contextData: PermissionContext = await this.getFileUploadPermissionContext(params);
        const storagePath = this.configFactory.getStoragePath({ context: contextData, type: params.type });
        const key: string = this.configFactory.generateKey(storagePath, params.title);
        const config = this.configFactory.getUploadConfiguration(key, passTransformStream, params.name);
        const currentUser: JwtUserData = this.currentUserService.get();

        const file: FileDto = new FileDto({
            description: params.description || "",
            name: params.name,
            title: params.title,
            uploadDate: new Date(),
            type: params.type,
            uploadedByUserId: currentUser.id,
            context: contextData,
            key,
        });

        this.validateFile(file);

        if (!currentUser) {
            throw new CurrentUserNotDefinedException();
        }

        return new Promise<FileDto>((resolve, reject) => {
            const multipartUpload$ = this.storage.upload(config);

            readStream.pipe(passTransformStream);

            readStream.on("error", (err) => {
                reject(err);
            });

            readStream.on("end", async () => {
                await multipartUpload$;

                const createdFile: FileDto = (await this.repository.create(file)).toJSON();
                createdFile.directUrl = this.storage.getDirectUrl(this.configFactory.getDownloadConfiguration(key));

                resolve(createdFile);
            });
        });
    }

    /**
     *  @param {FileUploadRequestModel} request file data upload request
     *  @returns {FileDto} in-system file representation
     *  @description Uploads file to the S3 File Storage, tracking file reference in `file` table
     */
    public async upload(request: FileUploadRequestModel): Promise<FileDto> {
        const fileOriginalName: string = request.data.originalname;
        const contextData: PermissionContext = await this.getFileUploadPermissionContext(request.file);
        const storagePath: string = this.configFactory.getStoragePath({ context: contextData, type: request.file.type });
        const key: string = this.configFactory.generateKey(storagePath, fileOriginalName);
        const config = this.configFactory.getUploadConfiguration(key, request.data.buffer, fileOriginalName);
        const currentUser: JwtUserData = this.currentUserService.get();

        if (!currentUser) {
            throw new CurrentUserNotDefinedException();
        }

        const file: FileDto = new FileDto({
            description: request.file.description || "",
            name: fileOriginalName,
            title: request.file.title,
            uploadDate: new Date(),
            type: request.file.type,
            uploadedByUserId: currentUser.id,
            context: contextData,
            key,
        });

        this.validateFile(file);

        await this.storage.upload(config);

        const createdFile: FileDto = (await this.repository.create(file)).toJSON();

        createdFile.directUrl = this.storage.getDirectUrl(this.configFactory.getDownloadConfiguration(key));

        return createdFile;
    }


    /**
     *  @param {Number[]} ids files ids to delete.
     *  @description Files are removed from `file` table first, then deleted from storage
     */
    public async multipleDelete(ids: number[]): Promise<void> {
        // 0. validate params
        // 1. find all files based on security context
        // 2. if some files are missing, reject request
        // 3. delete records
        // 4. call multiple remove from storage
        ValidatorService.compose([
            new NotEmptyValidator("ids")],
        )(ids);

        const fileLookupWhereOptions: WhereOptions<File> = { id: { [Op.in]: ids } };
        const secureFileLookupOptions: WhereOptions<File> = await this.permissionService.getFilePermissionContext(fileLookupWhereOptions);

        const files: File[] = await this.repository.findAll({ where: secureFileLookupOptions });
        const filesDtos: FileDto[] = _.map(files, (file: File) => this.typeMapper.map(File, FileDto, file.toJSON()));

        if (files.length !== ids.length) {
            throw new ForbiddenException(`File delete unauthorized attempt`);
        }

        await this.multipleDestroyBy(this.repository, ids);
        await this.storage.multipleDelete(this.configFactory.getMultipleDeleteConfiguration(_.map(filesDtos, file => file.key)));
    }

    /**
     *  @param {FileDto[]} files files to delete.
     */
    public async multipleUpdate(files: FileDto[]): Promise<FileDto[]> {
        const updatedFiles: File[] = await Promise.map(files, file => {
            return this.updateBy<File>(this.repository, File, file as any, "id", true, ["title", "description"]);
        }) as File[];

        return _.map(updatedFiles, file => this.typeMapper.map(File, FileDto, file));
    }

    /**
     *  @param {FileDto} file
     *  @returns {String} file direct url
     *  @description Methods returns 15-mins valid direct url.
     *  Validity duration can be overriten in {@link S3FileStorageConfigurationFactory} `getDownloadConfiguration` method. Refer to AWS S3 SDK docs.
     */
    public getDirectUrl(file: FileDto): string {
        ValidatorService.compose([
            new NotNilValidator("Key", "key"),
        ])(file);

        return this.storage.getDirectUrl(this.configFactory.getDownloadConfiguration(file.key));
    }

    /**
     *  @ignore
     */
    private validateFile(file: FileDto) {
        ValidatorService.compose([
            new EnumValueValidator<typeof FileType>(FileType, "type", "type"),
            new NotNilValidator("title", "title"),
            new NotNilValidator("name", "name"),
        ])(file);
    }

    /**
     *  @ignore
     */

    private async getFileUploadPermissionContext(params: { type: FileType; dealId: number }): Promise<PermissionContext> {
        return {};
    }
}
