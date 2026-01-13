import { NotificationAudience, NotificationType } from './notification.schema';
export declare class CreateNotificationDto {
    title: string;
    message: string;
    thumbnail?: string;
    type: NotificationType;
    audience: NotificationAudience;
    userIds?: string[];
    gateways: Array<'fcm' | 'sms' | 'email'>;
    metadata?: Record<string, any>;
    deliverAt?: string;
}
export declare class FilterNotificationDto {
    search?: string;
    type?: NotificationType;
    audience?: NotificationAudience;
    isRead?: boolean;
    userId?: string;
    page?: number;
    limit?: number;
}
export declare class UpdateNotificationUserStatusDto {
    isRead: boolean;
}
