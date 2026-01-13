import { NotificationHelper } from '@helpers/notification.helper';
import { NotificationAudience, NotificationType } from '@modules/notification/notification.schema';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

export interface SendNotificationJob {
  notificationId: string;
  title: string;
  message?: string;
  thumbnail?: string;
  type: NotificationType;
  audience: NotificationAudience;
  userIds?: string[];
  gateways: Array<'fcm' | 'sms' | 'email'>;
  metadata?: Record<string, any>;
}

@Processor('notification-queue')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationHelper: NotificationHelper) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'send-notification':
        return this.handleSend(job);

      case 'broadcast-notification':
        return this.handleBroadcast(job);

      default:
        this.logger.error(`Unknown job: ${job.name}`);
    }
  }

  /**
   * SEND NOTIFICATION (REGISTERED + GUESTS)
   */
  private async handleSend(job: Job<SendNotificationJob>) {
    const { title, message, gateways } = job.data;

    const { notificationContacts } = await this.notificationHelper.processNotification(job.data);

    // ---------------------------------------------------------------------
    // SEND NOTIFICATIONS
    // ---------------------------------------------------------------------
    if (gateways.includes('fcm') && notificationContacts.fcmTokens.length) {
      await this.processFcm(notificationContacts.fcmTokens, title, message);
    }

    if (gateways.includes('email') && notificationContacts.emails.length) {
      await this.notificationHelper.sendBulkEmails(notificationContacts.emails, title, message);
    }

    if (gateways.includes('sms') && notificationContacts.phones.length) {
      await this.notificationHelper.sendBulkSms(notificationContacts.phones, message);
    }
  }

  /**
   * BROADCAST NOTIFICATION
   */
  private async handleBroadcast(job: Job<SendNotificationJob>) {
    const { title, message, gateways } = job.data;

    if (gateways.includes('fcm')) await this.notificationHelper.broadcastFcm(title, message);
    if (gateways.includes('email')) await this.notificationHelper.broadcastEmail(title, message);
    if (gateways.includes('sms')) await this.notificationHelper.broadcastSms(message);

    return { broadcast: true };
  }

  /**
   * FCM BATCHED SEND
   */
  private async processFcm(tokens: string[], title: string, message: string) {
    if (!tokens.length) return;

    const BATCH = 500;

    for (let i = 0; i < tokens.length; i += BATCH) {
      const batch = tokens.slice(i, i + BATCH);
      await this.notificationHelper.sendFcmBatch(batch, title, message);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job completed: ${job.name}`);
  }
}
