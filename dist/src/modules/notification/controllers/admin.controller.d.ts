import { FilterNotificationDto, CreateNotificationDto } from '../notification.dto';
import { MulterS3File } from '@common/types/multer-s3-file';
import { NotificationService } from '../notification.service';
export declare class AdminNotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(params: FilterNotificationDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    getNotification(id: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    createNotification(dto: CreateNotificationDto, files: Record<string, MulterS3File[]>): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    deleteNotification(id: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
}
