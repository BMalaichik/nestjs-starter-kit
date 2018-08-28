import * as _ from "lodash";


export const list = [
    { name: "United States", code: "us" },
    { name: "England", code: "en" },
    { name: "Ukraine", code: "ua" },
];

export const codes: string[] = _.map(list, "code");

export function validate(code: string) {
    if (!_.find(list, { code })) {
        throw new Error(`Invlida country code provided: ${code}`);
    }
}
