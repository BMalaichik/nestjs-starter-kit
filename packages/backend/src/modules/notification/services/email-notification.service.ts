import { Injectable, Inject } from "@nestjs/common";

import * as _ from "lodash";

import { MailgunSdk } from "../sdk/mailgun.sdk";
import { NotificationDiToken } from "../notification.di";


export interface EmailPayload {
    to: string | string[];
    subject: string;
    text: string;
}

@Injectable()
export class EmailNotificationService {

    private readonly sender: string = "info@app.biz";

    public constructor(
        @Inject(NotificationDiToken.MAILGUN_SDK) private readonly sdk: MailgunSdk,
    ) {}

    public async notify(payload: EmailPayload): Promise<void> {
        await this.sdk.message(this.mapPayload(payload));
    }

    private mapPayload(payload: EmailPayload): any {
        return _.assign({}, payload, { from: this.sender });
    }
}
