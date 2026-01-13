import { Types } from 'mongoose';
import { ApiResponse } from '@common/types/api-response.type';
import { MulterS3File } from '@common/types/multer-s3-file';
import { CreateNotificationDto, FilterNotificationDto } from './notification.dto';
import { Queue } from 'bullmq';
import { NotificationRepository } from './notification.repository';
import { NotificationUserRepository } from '@modules/notification-user/notification-user.repository';
export declare class NotificationService {
    private readonly notificationQueue;
    private readonly notificationRepository;
    private readonly notificationUserRepository;
    constructor(notificationQueue: Queue, notificationRepository: NotificationRepository, notificationUserRepository: NotificationUserRepository);
    getNotifications(dto: FilterNotificationDto): Promise<ApiResponse>;
    getNotification(id: string): Promise<ApiResponse>;
    createNotification(body: CreateNotificationDto, files: Record<string, MulterS3File[]>): Promise<ApiResponse>;
    deleteNotification(id: string): Promise<ApiResponse>;
    markAsRead(userId: string, notificationUserId: string): Promise<ApiResponse>;
    markAllAsRead(userId: string): Promise<ApiResponse>;
    deleteUserNotification(userId: Types.ObjectId, notificationUserId: string): Promise<ApiResponse>;
    deleteAllUserNotifications(userId: Types.ObjectId): Promise<ApiResponse>;
}
