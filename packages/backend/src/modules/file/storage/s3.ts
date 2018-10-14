import * as AWS from "aws-sdk";
import * as Promise from "bluebird";


/**
 *  @returns {AWS.S3} AWS S3 preconfigured SDK instance
 */
export function s3Factory() {
    AWS.config.setPromisesDependency(Promise);

    return new AWS.S3({ signatureVersion: "v4" });
}
