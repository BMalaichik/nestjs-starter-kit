import { BaseDto } from "../../../base.dto";
import { ContactDto } from "../../contact";
import { IsString, IsEnum, IsBoolean, ValidateNested, IsNumber } from "class-validator";


export class UserRegistrationDto extends BaseDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsNumber()
    roleId: number;

    @ValidateNested()
    contact: ContactDto;
}
