import * as _ from "lodash";

import { UserDto } from "./user.dto";
import { TypeMapper } from "../shared";
import { ContactDto } from "../contact";
import { User, Contact } from "../db";


export function register(mapper: TypeMapper) {
    mapper.register(User, UserDto, (user: User, opts) => {
        const contact: ContactDto = mapper.map(Contact, ContactDto, user.contact);
        const fields = _.assign({}, user, { contact, passwordHash: opts.includeHash ? user.passwordHash : "" });

        return new UserDto(fields);
    });
}
