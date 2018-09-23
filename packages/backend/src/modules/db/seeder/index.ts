import { users } from "./user";
import { contacts } from "./contact";
import { products } from "./product";
import { Contact, User, Product } from "../entities";


export async function init() {
    await Contact.bulkCreate(contacts);
    await User.bulkCreate(users);
    await Product.bulkCreate(products);
}
