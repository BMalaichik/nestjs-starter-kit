import { BaseDto } from "../../base.dto";
import { Contact } from "../db";


export class ContactDto extends BaseDto {
    public id: number;
    public phone: string;
    public cell: string;
    public home: string;
    public fax: string;
    public email: string;
    public firstName: string;
    public dateOfBirth: string;
    public title: string;
    public ssn: string;
    public lastName: string;
    public city: string;
    public zip: string;
    public state: string;
    public country: string;
    public address: string;
}
