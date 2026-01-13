import { Injectable } from '@nestjs/common';
import twilio from 'twilio';

@Injectable()
export class SmsGateway {
  private readonly client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  async sendSMS(phone: string, message: string) {
    return this.client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
  }

  async sendBulkSms(phones: string[], message: string) {
    const jobs = phones.map((phone) => this.sendSMS(phone, message));
    return Promise.allSettled(jobs);
  }

  async broadcast(message: string) {
    console.log('Broadcasting SMS to all users:', message);
  }
}
