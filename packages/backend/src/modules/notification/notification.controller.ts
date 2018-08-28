import {
    Get,
    Controller,
    Inject,
    UseGuards,
} from "@nestjs/common";

import { AuthorizeGuard } from "../../http/guards";
import { NotificationDiToken, EmailNotificationService } from ".";


@Controller("/notification")
@UseGuards(AuthorizeGuard)
export class NotificationController {

    public constructor(
        @Inject(NotificationDiToken.EMAIL_NOTIFICATION_SERVICE) private readonly service: EmailNotificationService,
    ) { }

    @Get("/")
    public async get(): Promise<void> {
        await this.service.notify({ to: "maxasyan@gmail.com", subject: "Test email", text: `Hallo, my friend!` });
    }
}
