import { MailerHelper } from '@helpers/mailer.helper';
import { MailOptions } from '@common/interface';
export declare class EmailGateway {
    private readonly mailer;
    constructor(mailer: MailerHelper);
    sendEmail(option: MailOptions): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendBulkEmail(emails: string[], tpl: MailOptions): Promise<PromiseSettledResult<import("nodemailer/lib/smtp-transport").SentMessageInfo>[]>;
    broadcast(subject: string, html: string): Promise<void>;
}
