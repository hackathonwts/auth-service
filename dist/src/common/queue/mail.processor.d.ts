import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerHelper } from '@helpers/mailer.helper';
export declare class MailProcessor extends WorkerHost {
    private readonly mailerHelper;
    private readonly logger;
    constructor(mailerHelper: MailerHelper);
    process(job: Job<any>): Promise<any>;
    onCompleted(job: Job): void;
    onFailed(job: Job, err: Error): void;
}
