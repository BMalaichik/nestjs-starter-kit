import { BaseDto } from "../../../base.dto";
import { UserRole } from "../../db";
import { ContactDto } from "../../contact";


export class UserRegistrationDto extends BaseDto {
    username: string;
    password: string;
    role: UserRole;
    contact: ContactDto;
    publicPlacementAgreed?: boolean;
}
