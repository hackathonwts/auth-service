import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { MailerHelper } from '@helpers/mailer.helper';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);
  constructor(private readonly mailerHelper: MailerHelper) {
    super();
  }

  // Job handler
  async process(job: Job<any>): Promise<any> {
    if (job.name === 'send-email') {
      await this.mailerHelper.sendMail(job.data);
    }
  }

  // Optional: Log success/failure
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`✅ Mail job completed: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`❌ Mail job failed: ${job.id}`, err);
  }
}
