import * as _ from "lodash";


export function fieldsSet<T>(source: T, fields: (keyof T)[]): boolean {
    return source && _.every(fields, field => !!source[field]);
}
