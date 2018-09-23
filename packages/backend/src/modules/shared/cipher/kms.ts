import { KMS } from "aws-sdk";

export function kmsFactory(): KMS {
    return new KMS({ });
}
