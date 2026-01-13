import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailOptions } from '@common/interface';
export declare class MailerHelper {
    private readonly configService;
    constructor(configService: ConfigService);
    sendMail(option: MailOptions): Promise<SMTPTransport.SentMessageInfo>;
}
