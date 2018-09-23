import { Module, NestModule, MiddlewareConsumer, RequestMethod, forwardRef, Inject } from "@nestjs/common";

import { DbModule } from "../db";
import { UserModule } from "../user";
import { AuthDiToken } from "./auth.di";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule } from "../config";
import { authProviders } from "./auth.providers";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "./auth.middleware";
import { CurrentUserService } from "./services";


@Module({
    imports: [ConfigModule, DbModule, forwardRef(() => UserModule) ],
    providers: [JwtStrategy, ...authProviders],
    exports: [...authProviders],
    controllers: [AuthController],
})
export class AuthModule implements NestModule {
    public constructor(
        @Inject(AuthDiToken.CURRENT_USER_SERVICE) private readonly currentUserService: CurrentUserService,
    ) {

    }
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
        consumer
            .apply(AuthMiddleware)
            .with(this.currentUserService)
            .forRoutes({ path: "*", method: RequestMethod.ALL });
    }
}
