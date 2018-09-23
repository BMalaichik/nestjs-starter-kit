import * as _ from "lodash";
import { Contact } from "../db";
import { TypeMapper } from "../shared";
import { ContactDto, splitFullNameSafe, getFullNameSafe } from "./contact.dto";


export function register(mapper: TypeMapper) {
    mapper.register(Contact, ContactDto, (contact: Contact) => {
        const name: string = getFullNameSafe(contact.firstName, contact.lastName);

        return new ContactDto({ ...contact, name });
    });

    mapper.register(ContactDto, Contact, (contact: ContactDto) => {
        const [firstName, lastName] = splitFullNameSafe(contact.name);
        const data = _.assign({}, contact, { firstName, lastName });

        return new Contact(data);
    });
}
