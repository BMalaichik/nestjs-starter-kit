import {
    Get,
    Query,
    Controller,
    Inject,
    UseGuards,
    HttpStatus,
    HttpCode,
} from "@nestjs/common";

import { AuthorizeGuard } from "../../http/guards";
import { ContactDiToken } from "./contact.di";
import { ContactService } from "./contact.service";


@Controller("/contact")
@UseGuards(AuthorizeGuard)
export class ContactController {

    public constructor(
        @Inject(ContactDiToken.CONTACT_SERVICE) private readonly contactService: ContactService,
    ) { }

    @Get("/email/validate")
    @HttpCode(HttpStatus.NO_CONTENT)
    public validateEmail(@Query("value") email: string): Promise<void> {
        return this.contactService.validateEmail(email);
    }
}
