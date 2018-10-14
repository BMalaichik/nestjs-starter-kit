import { BaseDto } from "../../../base.dto";
import { UserRole } from "../../db";
import { ContactDto } from "../../contact";
import { IsString, IsEnum, IsBoolean, ValidateNested } from "class-validator";


export class UserRegistrationDto extends BaseDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @ValidateNested()
    contact: ContactDto;

    @IsBoolean()
    publicPlacementAgreed?: boolean;
}
