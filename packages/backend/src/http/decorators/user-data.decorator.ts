import { createRouteParamDecorator } from "@nestjs/common";


export const UserData = createRouteParamDecorator((req, res) => req.user);
