import { SendNotificationJob } from '@common/queue/notification.processor';
import { EmailGateway } from '@config/gateways/email.gateway';
import { FcmGateway } from '@config/gateways/fcm.gateway';
import { SmsGateway } from '@config/gateways/sms.gateway';
import { NotificationUserRepository } from '@modules/notification-user/notification-user.repository';
import { UserDeviceRepository } from '@modules/user-devices/repository/user-device.repository';
import { UserRepository } from '@modules/user/user.repository';
import * as admin from 'firebase-admin';
export declare class NotificationHelper {
    private readonly fcm;
    private readonly sms;
    private readonly email;
    private readonly userRepository;
    private readonly userDeviceRepository;
    private readonly notificationUserRepository;
    private readonly logger;
    constructor(fcm: FcmGateway, sms: SmsGateway, email: EmailGateway, userRepository: UserRepository, userDeviceRepository: UserDeviceRepository, notificationUserRepository: NotificationUserRepository);
    processNotification(payload: SendNotificationJob): Promise<{
        notificationContacts: {
            fcmTokens: string[];
            emails: string[];
            phones: string[];
        };
    }>;
    sendFcmBatch(tokens: string[], title: string, message: string): Promise<admin.messaging.BatchResponse>;
    sendBulkEmails(emails: string[], title: string, message: string): Promise<void>;
    sendBulkSms(phones: string[], message: string): Promise<void>;
    broadcast(payload: SendNotificationJob): Promise<any[]>;
    broadcastFcm(title: string, message: string): Promise<string>;
    broadcastEmail(title: string, message: string): Promise<void>;
    broadcastSms(message: string): Promise<void>;
}
