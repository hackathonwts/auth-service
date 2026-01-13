import { StatusEnum } from '@common/enum/status.enum';
import { MailOptions } from '@common/interface';
import { SendNotificationJob } from '@common/queue/notification.processor';
import { EmailGateway } from '@config/gateways/email.gateway';
import { FcmGateway } from '@config/gateways/fcm.gateway';
import { SmsGateway } from '@config/gateways/sms.gateway';
import { NotificationUserRepository } from '@modules/notification-user/notification-user.repository';
import { NotificationAudience } from '@modules/notification/notification.schema';
import { UserDeviceRepository } from '@modules/user-devices/repository/user-device.repository';
import { UserRepository } from '@modules/user/user.repository';
import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationHelper {
  private readonly logger = new Logger(NotificationHelper.name);

  constructor(
    private readonly fcm: FcmGateway,
    private readonly sms: SmsGateway,
    private readonly email: EmailGateway,
    private readonly userRepository: UserRepository,
    private readonly userDeviceRepository: UserDeviceRepository,
    private readonly notificationUserRepository: NotificationUserRepository,
  ) {}

  async processNotification(payload: SendNotificationJob): Promise<{
    notificationContacts: {
      fcmTokens: string[];
      emails: string[];
      phones: string[];
    };
  }> {
    const { notificationId, audience, userIds } = payload;
    let registeredUserIds: string[] = [];
    const notificationContacts = {
      fcmTokens: [] as string[],
      emails: [] as string[],
      phones: [] as string[],
    };

    this.logger.log(`Processing audience: ${audience}`);

    // ---------------------------------------------------------------------
    // AUDIENCE: ALL → ALL REGISTERED USERS + ALL GUESTS
    // ---------------------------------------------------------------------
    if (audience === NotificationAudience.ALL) {
      const devices = await this.userDeviceRepository.getAllByField({ isLoggedOut: false });

      // Collect FCM tokens (guests + registered)
      for (const d of devices) {
        if (d.deviceToken) notificationContacts.fcmTokens.push(d.deviceToken);
      }

      // Extract unique registered userIds
      const uniqueRegisteredIds = [...new Set(devices.filter((d) => d.user_id).map((d) => d.user_id.toString()))];

      registeredUserIds = uniqueRegisteredIds;

      // Fetch registered user details once
      const users = await this.userRepository.getAllByField({
        _id: { $in: uniqueRegisteredIds },
        isDeleted: false,
        status: StatusEnum.Active,
      });

      // Collect email + phone
      for (const u of users) {
        if (u.email) notificationContacts.emails.push(u.email);
        if (u.phone) notificationContacts.phones.push(u.phone);
      }
    }

    // ---------------------------------------------------------------------
    // AUDIENCE: ADMINS → ONLY ADMINS (NO GUESTS)
    // ---------------------------------------------------------------------
    else if (audience === NotificationAudience.ADMINS) {
      const adminUsers = await this.userRepository.getAllByField({
        role: 'admin',
        isDeleted: false,
        status: StatusEnum.Active,
      });

      registeredUserIds = adminUsers.map((u) => u._id.toString());

      for (const u of adminUsers) {
        if (u.email) notificationContacts.emails.push(u.email);
        if (u.phone) notificationContacts.phones.push(u.phone);
      }

      const adminDevices = await this.userDeviceRepository.getAllByField({
        user_id: { $in: registeredUserIds },
        isLoggedOut: false,
      });

      for (const d of adminDevices) {
        if (d.deviceToken) notificationContacts.fcmTokens.push(d.deviceToken);
      }
    }

    // ---------------------------------------------------------------------
    // AUDIENCE: USERS → ONLY REGISTERED (NON-ADMIN)
    // ---------------------------------------------------------------------
    else if (audience === NotificationAudience.USERS) {
      const normalUsers = await this.userRepository.getAllByField({
        role: 'user',
        isDeleted: false,
        status: StatusEnum.Active,
      });

      registeredUserIds = normalUsers.map((u) => u._id.toString());

      for (const u of normalUsers) {
        if (u.email) notificationContacts.emails.push(u.email);
        if (u.phone) notificationContacts.phones.push(u.phone);
      }

      const userDevices = await this.userDeviceRepository.getAllByField({
        user_id: { $in: registeredUserIds },
        isLoggedOut: false,
      });

      for (const d of userDevices) {
        if (d.deviceToken) notificationContacts.fcmTokens.push(d.deviceToken);
      }
    }

    // ---------------------------------------------------------------------
    // AUDIENCE: CUSTOM → EXACTLY GIVEN REGISTERED USERS
    // ---------------------------------------------------------------------
    else if (audience === NotificationAudience.CUSTOM) {
      const selectedUsers = await this.userRepository.getAllByField({
        _id: { $in: userIds },
        isDeleted: false,
        status: StatusEnum.Active,
      });

      registeredUserIds = selectedUsers.map((u) => u._id.toString());

      for (const u of selectedUsers) {
        if (u.email) notificationContacts.emails.push(u.email);
        if (u.phone) notificationContacts.phones.push(u.phone);
      }

      const devices = await this.userDeviceRepository.getAllByField({
        user_id: { $in: registeredUserIds },
        isLoggedOut: false,
      });

      for (const d of devices) {
        if (d.deviceToken) notificationContacts.fcmTokens.push(d.deviceToken);
      }
    } else {
      this.logger.warn(`Invalid audience type:`, audience);
    }

    // ---------------------------------------------------------------------
    // SAVE REGISTERED USERS (guests do not have userId)
    // ---------------------------------------------------------------------
    if (registeredUserIds.length) {
      await this.notificationUserRepository.saveMany(
        registeredUserIds.map((uid) => ({
          notificationId,
          userId: uid,
          isRead: false,
          status: 'pending',
        })),
      );
      this.logger.log(`Stored ${registeredUserIds.length} notification-user records.`);
    }

    return {
      notificationContacts,
    };
  }

  // ==========================================================================
  //    1. SEND NOTIFICATION (REGISTERED + GUESTS)
  // ==========================================================================
  async sendFcmBatch(tokens: string[], title: string, message: string): Promise<admin.messaging.BatchResponse> {
    if (!tokens.length) return;

    // Use FCM multicast (supports up to 500 tokens)
    const response = await this.fcm.sendMulticast(tokens, title, message);

    // Remove invalid tokens from DB (optional)
    if (response.failureCount > 0) {
      const failedTokens = [];

      for (const [idx, res] of response.responses.entries()) {
        if (!res.success) failedTokens.push(tokens[idx]);
      }

      if (failedTokens.length) {
        this.logger.warn(`Found invalid FCM tokens: ${failedTokens.length}`);
        await this.userDeviceRepository.bulkDelete(failedTokens);
      }
    }

    return response;
  }

  async sendBulkEmails(emails: string[], title: string, message: string) {
    if (!emails.length) return;

    const tpl: MailOptions = {
      from: process.env.MAIL_FROM,
      to: undefined,
      subject: title,
      template: 'notification',
      locals: { title, message },
    };

    const CHUNK = 200; // to avoid SMTP throttling

    for (let i = 0; i < emails.length; i += CHUNK) {
      const batch = emails.slice(i, i + CHUNK);
      await this.email.sendBulkEmail(batch, tpl);
    }
  }

  async sendBulkSms(phones: string[], message: string) {
    if (!phones.length) return;

    const CHUNK = 100; // depends on your SMS provider

    for (let i = 0; i < phones.length; i += CHUNK) {
      const batch = phones.slice(i, i + CHUNK);
      await this.sms.sendBulkSms(batch, message);
    }
  }

  /**
   * ==========================================================================
   *    2. BROADCAST NOTIFICATION (GLOBAL)
   * ==========================================================================
   */
  async broadcast(payload: SendNotificationJob) {
    const { gateways, title, message } = payload;

    const promises = [];

    if (gateways.includes('fcm')) {
      promises.push(this.broadcastFcm(title, message));
    }

    if (gateways.includes('sms')) {
      promises.push(this.broadcastSms(message));
    }

    if (gateways.includes('email')) {
      promises.push(this.broadcastEmail(title, message));
    }

    return Promise.all(promises);
  }

  // FCM Broadcast
  async broadcastFcm(title: string, message: string) {
    return this.fcm.broadcast(title, message);
  }

  // Email Broadcast
  async broadcastEmail(title: string, message: string) {
    return this.email.broadcast(title, message);
  }

  // SMS Broadcast
  async broadcastSms(message: string) {
    return this.sms.broadcast(message);
  }
}
