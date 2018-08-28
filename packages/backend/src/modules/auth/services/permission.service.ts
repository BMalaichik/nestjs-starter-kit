import { Component, Inject, ForbiddenException } from "@nestjs/common";

import * as _ from "lodash";
import { WhereOptions, AnyWhereOptions } from "sequelize";

import { File } from "../../db";
import { BaseService } from "../../../base.service";
import { AuthDiToken } from "../auth.di";
import { JwtUserData } from "../auth.interfaces";
import { CurrentUserService } from "./current-user.service";


export interface PermissionContext {
    
}


@Component()
export class PermissionService extends BaseService {

    public constructor(
        @Inject(AuthDiToken.CURRENT_USER_SERVICE) private readonly currentUserService: CurrentUserService,
    ) {
        super();
    }

    public async getFilePermissionContext(opts: WhereOptions<File> = {}): Promise<WhereOptions<File>> {
        const currentUser: JwtUserData = this.currentUserService.get();

        if (!currentUser) {
            throw new ForbiddenException(`No current user resolved for permission context request`);
        }

        // TODO: define file context on demand
        return opts;
    }
}
