import { BaseDto } from "../../../base.dto";
import { UserRole } from "../../db";
import { ContactDto } from "../../contact";


export class UserDto extends BaseDto {
    id: number;
    isActive?: boolean;
    publicPlacementAgreed?: boolean;
    role: UserRole;
    contactId: number;
    lastLogin: Date;
    username: string;
    contact: ContactDto;
    passwordHash?: string;
}
