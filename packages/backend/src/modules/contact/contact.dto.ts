import * as _ from "lodash";

import { BaseDto } from "../../base.dto";


/**
 *  Returns safe parsed first & last name
 */
export function splitFullNameSafe(fullName: string = "", defaultValue: string = ""): string[] {
    const firstLastNameSplit: string[] = fullName.split(/\s+/g);
    const [firstName, lastName] = [_.dropRight(firstLastNameSplit).join(" "), _.last(firstLastNameSplit)];

    return [
        firstName || defaultValue,
        lastName || defaultValue,
    ];
}

export function getFullNameSafe(firstName: string = "", lastName: string = "") {
    return _.trim(`${firstName || ""} ${lastName || ""}`);
}

export class ContactDto extends BaseDto {
    public id: number;
    public phone: string;
    public cell: string;
    public home: string;
    public fax: string;
    public email: string;
    public name: string;
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
