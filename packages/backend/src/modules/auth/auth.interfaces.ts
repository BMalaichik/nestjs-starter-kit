import { UserRole } from "../db";


export interface UserLoginDto {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export class ResendInviteDto {
    username?: string;
    email?: string;
}

export class ResetPasswordDto extends ResendInviteDto {}

export interface JwtUserData {
    id: number;
    email: string;
    name: string;
    roles: UserRole[];
}
