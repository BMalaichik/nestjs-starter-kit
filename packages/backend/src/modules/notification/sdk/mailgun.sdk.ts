import { Component, Inject } from "@nestjs/common";

import * as mailgun from "mailgun-js";
import * as Bluebird from "bluebird";

import { Config, ConfigDiToken } from "../../config";


@Component()
export class MailgunSdk {

    private client;

    public constructor(
        @Inject(ConfigDiToken.CONFIG) private readonly config: Config,
    ) {
        this.client = mailgun({ apiKey: config.mailgun.apiKey, domain: config.mailgun.domain });
    }

    public async message(data: any): Promise<void> {
        const context = this.client.messages();

        await (Bluebird.promisify(context.send, { context }) as any)(data);
    }
}
