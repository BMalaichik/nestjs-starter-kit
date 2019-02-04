import * as JsZip from "jszip";

/**
 *  In-memory archive representation. jszip-archive wrapper
 *  - constructor(): creates class instance with empty jszip array.
 *  - append(filename: string, data: any): attach file data to archive.
 *      example:
 *              const archive = new archive();
 *              archive.append("some filename", dataBuffer);
 *              archive.append("some filename 2", "Hello world!");
 *  - generate(): return archive buffer promise. By our default, generates output as node.js Buffer. checkout documentation for possible options.
 *      example:
 *              const archive = new Archive();
 *              archive.append("some filename", dataBuffer);
 *              const data: Buffer = await archive.generate();
 */

export class Archive {

    private archive: JsZip;
    private generateConfig;

    public constructor() {
        this.archive = new JsZip();
        this.generateConfig = {
            type: "nodebuffer",
        };
    }

    public append(filename: string, data: any): Archive {
        if (!filename || !data) {
            throw new Error(`invalid add file entry request, filename=${filename}; data= ${data}`);
        }

        this.archive.file(filename, data);

        return this;
    }

    public generate(config?: any): Promise<Buffer> {
        return this.archive.generateAsync(config || this.generateConfig);
    }
}
