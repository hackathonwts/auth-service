import { Injectable } from '@nestjs/common';
import { MailerHelper } from '@helpers/mailer.helper';
import { MailOptions } from '@common/interface';

@Injectable()
export class EmailGateway {
  constructor(private readonly mailer: MailerHelper) {}

  async sendEmail(option: MailOptions) {
    return this.mailer.sendMail(option);
  }

  async sendBulkEmail(emails: string[], tpl: MailOptions) {
    const jobs = emails.map((email) => {
      return this.mailer.sendMail({ ...tpl, to: email });
    });

    return Promise.allSettled(jobs);
  }

  async broadcast(subject: string, html: string) {
    console.log('Broadcasting Email to all users:', subject, html);
    // Implementation depends on the email service provider
  }
}
