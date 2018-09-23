import { Injectable } from "@nestjs/common";

import * as crypto from "bcrypt";
import { generate } from "generate-password";

import { InvalidPasswordException } from "../exceptions";


@Injectable()
export class PasswordService {

    public async generate(): Promise<string> {
        return generate({ strict: true });
    }

    public hash(password: string): Promise<string> {
        return crypto.hash(password, 10);
    }

    public async verify(password: string, hash: string): Promise<void> {
        if (!await crypto.compare(password, hash)) {
            throw new InvalidPasswordException();
        }
    }
}
