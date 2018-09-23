import { createParamDecorator } from "@nestjs/common";


export const UserData = createParamDecorator((req, res) => req.user);
