import { Contact } from "../db";
import { TypeMapper } from "../shared";
import { ContactDto } from "./contact.dto";


export function register(mapper: TypeMapper) {
    mapper.register(Contact, ContactDto, (contact: Contact) => {
        return new ContactDto({ ...contact });
    });

    mapper.register(ContactDto, Contact, (contact: ContactDto) => {
        return new Contact({ ...contact });
    });
}
