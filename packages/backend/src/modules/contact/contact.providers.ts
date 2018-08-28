import { ContactDiToken } from "./contact.di";
import { ContactService } from "./contact.service";


export const contactProviders = [
    {
        provide: ContactDiToken.CONTACT_SERVICE,
        useClass: ContactService,
    },
];
