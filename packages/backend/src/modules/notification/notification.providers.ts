import { MailgunSdk } from "./sdk/mailgun.sdk";
import { NotificationDiToken } from "./notification.di";
import { EmailNotificationService } from "./services";


export const notificationProviders = [
    {
        provide: NotificationDiToken.MAILGUN_SDK,
        useClass: MailgunSdk,
    },
    {
        provide: NotificationDiToken.EMAIL_NOTIFICATION_SERVICE,
        useClass: EmailNotificationService,
    },
];
