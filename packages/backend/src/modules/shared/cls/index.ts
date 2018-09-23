import * as clsBluebird from "cls-bluebird";
import { createNamespace, getNamespace as getClsNamespace } from "cls-hooked";


const APP_CONTINUATION_KEY = "app-continuation-key";

const namespace = createNamespace(APP_CONTINUATION_KEY);
clsBluebird(namespace);

export function getNamespace() {
    return getClsNamespace(APP_CONTINUATION_KEY);
}

