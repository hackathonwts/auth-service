import { NotificationHelper } from '@helpers/notification.helper';
import { NotificationAudience, NotificationType } from '@modules/notification/notification.schema';
import { WorkerHost } from '@nestjs/bullmq';
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
export declare class NotificationProcessor extends WorkerHost {
    private readonly notificationHelper;
    private readonly logger;
    constructor(notificationHelper: NotificationHelper);
    process(job: Job): Promise<any>;
    private handleSend;
    private handleBroadcast;
    private processFcm;
    onCompleted(job: Job): void;
}
