import { Inject, Component } from "@nestjs/common";

import * as passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AuthService } from "./services/auth.service";
import { AuthDiToken } from "./auth.di";
import { Config, ConfigDiToken } from "../config";


@Component()
export class JwtStrategy extends Strategy {

    public constructor(
        @Inject(AuthDiToken.AUTH_SERVICE) private readonly authService: AuthService,
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: AuthService.SECRET,
            },
            async (req, payload, next) => await this.verify(req, payload, next),
        );
        passport.use(this);
    }

    public verify(req, payload, done): void {
        // add here additional checks on demand
        // called after token was decoded but not
        done(null, payload);
    }
}
