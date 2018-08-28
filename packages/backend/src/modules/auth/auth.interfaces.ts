import { UserRole } from "../db";


export interface UserLoginDto {
    email: string;
    password: string;
}


export interface JwtUserData {
    id: number;
    email: string;
    name: string;
    roles: UserRole[];
}
