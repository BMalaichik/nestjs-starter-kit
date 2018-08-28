import { BaseDto } from "../../base.dto";
import { UserRole } from "../db";
import { ContactDto } from "../contact";
import { DepartmentDto } from "../department";


export class UserDto extends BaseDto {
    id: number;
    isActive?: boolean;
    role: UserRole;
    contactId: number;
    contact: ContactDto;
    departmentId: number;
    department: DepartmentDto;
    passwordHash?: string;
}
