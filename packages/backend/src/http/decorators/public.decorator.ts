import { ReflectMetadata } from "@nestjs/common";


export const PUBLIC_METADATA_TOKEN = "is_public";

export const Public = () => ReflectMetadata(PUBLIC_METADATA_TOKEN, true);
