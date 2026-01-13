import { Module, OnModuleInit, INestApplication } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import expressBasicAuth from 'express-basic-auth';
// Helpers
import { MailerHelper } from '@helpers/mailer.helper';
import { NotificationHelper } from '@helpers/notification.helper';
// Processors
import { MailProcessor } from './mail.processor';
import { NotificationProcessor } from './notification.processor';
import { EmailGateway } from '@config/gateways/email.gateway';
import { FcmGateway } from '@config/gateways/fcm.gateway';
import { SmsGateway } from '@config/gateways/sms.gateway';
import { LeaderboardProcessor } from './leaderboard.processor';

@Module({
  imports: [
    // Proper queue registration
    BullModule.registerQueue(
      {
        name: 'notification-queue',
        defaultJobOptions: {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      },
      {
        name: 'mail-queue',
        defaultJobOptions: {
          removeOnComplete: true,
          attempts: 3,
        },
      },
      {
        name: 'report-queue',
        defaultJobOptions: {
          removeOnComplete: true,
        },
      },
      {
        name: 'leaderboard-queue',
        defaultJobOptions: {
          removeOnComplete: true,
        },
      },
    ),
  ],
  providers: [MailProcessor, MailerHelper, NotificationProcessor, NotificationHelper, FcmGateway, SmsGateway, EmailGateway, LeaderboardProcessor],
  exports: [BullModule],
})
export class QueueModule implements OnModuleInit {
  private readonly serverAdapter = new ExpressAdapter();

  constructor(
    @InjectQueue('mail-queue') private readonly mailQueue: Queue,
    @InjectQueue('notification-queue') private readonly notificationQueue: Queue,
    @InjectQueue('report-queue') private readonly reportQueue: Queue,
    @InjectQueue('leaderboard-queue') private readonly leaderboardQueue: Queue,
  ) {}

  onModuleInit() {
    this.serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [new BullMQAdapter(this.mailQueue), new BullMQAdapter(this.notificationQueue), new BullMQAdapter(this.reportQueue), new BullMQAdapter(this.leaderboardQueue)],
      serverAdapter: this.serverAdapter,
    });
  }

  public setupBullBoard(app: INestApplication) {
    app.use(
      '/admin/queues',
      expressBasicAuth({
        users: { admin: process.env.BULLBOARD_PASSWORD || 'secret123' },
        challenge: true,
        unauthorizedResponse: () => 'Unauthorized',
      }),
      this.serverAdapter.getRouter(),
    );
  }
}
