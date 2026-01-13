import { Global, Module } from '@nestjs/common';
import { MailerHelper } from './mailer.helper';
import { NotificationHelper } from './notification.helper';
import { EmailGateway } from '@config/gateways/email.gateway';
import { FcmGateway } from '@config/gateways/fcm.gateway';
import { SmsGateway } from '@config/gateways/sms.gateway';
@Global()
@Module({
  imports: [],
  providers: [MailerHelper, NotificationHelper, FcmGateway, SmsGateway, EmailGateway],
  exports: [MailerHelper, NotificationHelper, FcmGateway, SmsGateway, EmailGateway],
})
export class HelpersModule {}
