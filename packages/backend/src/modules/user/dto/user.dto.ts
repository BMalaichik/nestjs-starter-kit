import { BaseDto } from "../../../base.dto";
import { ContactDto } from "../../contact";
import { RoleDto } from "../../auth/dto";


export class UserDto extends BaseDto {
    id: number;
    isActive?: boolean;
    publicPlacementAgreed?: boolean;
    role: RoleDto;
    contactId: number;
    lastLogin: Date;
    username: string;
    contact: ContactDto;
    passwordHash?: string;
}
