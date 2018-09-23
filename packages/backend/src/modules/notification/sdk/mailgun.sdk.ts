import { Injectable, Inject } from "@nestjs/common";

import * as mailgun from "mailgun-js";
import * as Bluebird from "bluebird";
import { Config, ConfigDiToken } from "../../config";


@Injectable()
export class MailgunSdk {

    private client;

    public constructor(
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
    ) {
        if (config.mailgun) {
            this.client = mailgun(config.mailgun);
        }
    }

    public async message(data: any): Promise<void> {
        if (!this.client) {
            throw new Error(`Mailgun config is not defined`);
        }

        const context = this.client.messages();

        await (Bluebird.promisify(context.send, { context }) as any)(data);
    }
}
