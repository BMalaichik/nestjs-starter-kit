import { BaseDto } from "../../../base.dto";
import { UserDto } from "../../user";
import { FileType } from "../../db";
import { PermissionContext } from "../../auth";


export class FileDto extends BaseDto {
    id: number;
    uploadDate: Date;
    type: FileType;
    title: string;
    key: string;
    description: string;
    name: string;
    directUrl: string;
    context: PermissionContext;
    uploadedByUserId: number;
    uploadedBy: UserDto;
}
