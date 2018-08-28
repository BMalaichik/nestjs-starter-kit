import * as _ from "lodash";
import { Component, Inject } from "@nestjs/common";


import { ContactDto } from "./contact.dto";
import { BaseService } from "../../base.service";
import { UpdateOptions } from "sequelize";
import { DbDiToken, Contact } from "../db";
import { EmailExistsException } from "./exceptions/email-exists.exception";
import { EntityNotFoundException, InvalidArgumentException } from "../../http/exceptions";
import { TypeMapperDiToken, TypeMapper } from "../shared";


@Component()
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

    public async update(contact: ContactDto): Promise<ContactDto> {
        const updateOptions: UpdateOptions = { where: { id: contact.id }, limit: 1, returning: true };
        const [updatedAmount, updatedRecords] = await this.repository.update(contact, updateOptions);

        if (updatedAmount !== 1) {
            throw new EntityNotFoundException("Contact", contact.id);
        }

        const [updatedContact] = updatedRecords;

        return this.typeMapper.map(Contact, ContactDto, updatedContact);
    }

    public map2Dto(contact: Contact): ContactDto {
        return new ContactDto(contact);
    }

    public map2Entity(contact: ContactDto): Contact {
        return new Contact({ ...contact });
    }
}
