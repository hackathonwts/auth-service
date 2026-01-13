import { Injectable } from '@nestjs/common';
import { resolve } from 'node:path';
import nodemailer from 'nodemailer';
import Email from 'email-templates';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailOptions } from '@common/interface';

@Injectable()
export class MailerHelper {
  constructor(private readonly configService: ConfigService) {}

  async sendMail(option: MailOptions): Promise<SMTPTransport.SentMessageInfo> {
    const { from, to, subject, template, locals } = option;
    const templateDir = resolve('./views/', 'email-templates', template, 'html');
    const email = new Email({
      views: {
        root: templateDir,
        options: {
          extension: 'ejs',
        },
      },
    });

    const getMailBody = await email.render(templateDir, locals);

    const transporter = nodemailer.createTransport(
      new SMTPTransport({
        // service: this.configService.getOrThrow<string>('MAIL_MAILER'),
        host: this.configService.getOrThrow<string>('MAIL_HOST'),
        port: Number.parseInt(this.configService.getOrThrow<string>('MAIL_PORT')), // Ensure it's a number
        secure: this.configService.getOrThrow<string>('MAIL_SECURE') === 'true', // true for 465, false for other ports
        auth: {
          user: this.configService.getOrThrow<string>('MAIL_USERNAME'),
          pass: this.configService.getOrThrow<string>('MAIL_PASSWORD'),
          // clientId: this.configService.get<string>('MAIL_CLIENT_ID'),
          // clientSecret: this.configService.get<string>('MAIL_CLIENT_SECRET'),
          // refreshToken: this.configService.get<string>('MAIL_REFRESH_TOKEN'),
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
    );

    const mailOptions = {
      from,
      to,
      subject,
      html: getMailBody,
    };

    return await transporter.sendMail(mailOptions);
  }
}
