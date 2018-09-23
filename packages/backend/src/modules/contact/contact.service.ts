import * as _ from "lodash";
import { Inject, Injectable } from "@nestjs/common";


import { ContactDto } from "./contact.dto";
import { BaseService } from "../../base.service";
import { UpdateOptions } from "sequelize";
import { DbDiToken, Contact } from "../db";
import { EmailExistsException } from "./exceptions/email-exists.exception";
import { EntityNotFoundException, InvalidArgumentException } from "../../http/exceptions";
import { TypeMapperDiToken, TypeMapper } from "../shared";


@Injectable()
export class ContactService extends BaseService {

    public constructor(
        @Inject(DbDiToken.CONTACT_REPOSITORY) private readonly repository: typeof Contact,
        @Inject(TypeMapperDiToken.MAPPER) private readonly typeMapper: TypeMapper,
    ) {
        super();
    }

    public async create(contact: ContactDto): Promise<ContactDto> {
        const createdContact: Contact = (await this.repository.create(contact)).toJSON();

        return this.typeMapper.map(Contact, ContactDto, createdContact);
    }

    public async validateEmail(value: string): Promise<void> {
        if (_.isEmpty(value)) {
            throw new InvalidArgumentException("value", value);
        }

        const exists: boolean =  !!(await this.repository.findOne({ where: { email: value } }));

        if (exists) {
            throw new EmailExistsException();
        }
    }

    public async delete(id: number): Promise<void> {
        return super.destroyBy(this.repository, id);
    }

    public async multipleDelete(ids: number[]): Promise<number> {
        return super.multipleDestroyBy(this.repository, ids);
    }

    public async getById(id: number): Promise<ContactDto> {
        const contact: Contact = (await this.repository.findById(id)).toJSON();

        return this.typeMapper.map(Contact, ContactDto, contact);
    }

    public async update(contact: ContactDto): Promise<ContactDto> {
        const result: Contact = await super.updateBy<Contact>(this.repository, Contact, contact, "id", true) as Contact;

        return this.typeMapper.map(Contact, ContactDto, result);
    }


}
