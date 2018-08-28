import { Component } from "@nestjs/common";

import { JwtUserData } from "../auth.interfaces";
import { getNamespace } from "../../shared/cls";


const USER_CLS_KEY = "user";

@Component()
export class CurrentUserService {

    public get(): JwtUserData | null {
        const appNamespace = getNamespace();

        const user = appNamespace.get(USER_CLS_KEY);

        return user || null;
    }

    public set(user: JwtUserData): JwtUserData {
        const appNamespace = getNamespace();

        return appNamespace.set(USER_CLS_KEY, user);
    }
}
