import { users } from "./user";
import { contacts } from "./contact";
import { shops } from "./shop";
import { products } from "./product";
import { categories } from "./category";
import { Contact, User, Product, Category, Shop } from "../entities";


export async function init() {
    await Contact.bulkCreate(contacts);
    await User.bulkCreate(users);
    await Shop.bulkCreate(shops);
    await Category.bulkCreate(categories);
    await Product.bulkCreate(products);
}
