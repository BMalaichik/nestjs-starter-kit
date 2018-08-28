import { users } from "./user";
import { contacts } from "./contact";
import { Contact, User } from "../entities";


export async function init() {
    await Contact.bulkCreate(contacts);
    await User.bulkCreate(users);
}
