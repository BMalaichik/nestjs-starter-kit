import * as AWS from "aws-sdk";
import * as Promise from "bluebird";


export function s3Factory() {
    AWS.config.setPromisesDependency(Promise);

    return new AWS.S3({ signatureVersion: "v4" });
}
