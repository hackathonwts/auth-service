import { NotificationService } from '../notification.service';
import { UserDocument } from '@modules/user/user.schema';
import { FilterNotificationDto } from '../notification.dto';
export declare class UserNotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(params: FilterNotificationDto, user: UserDocument): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    getNotification(id: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    markRead(user: UserDocument, notificationUserId: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    markAllRead(user: UserDocument): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    deleteNotification(user: UserDocument, notificationUserId: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    deleteAllNotifications(user: UserDocument): Promise<import("../../../common/types/api-response.type").ApiResponse>;
}
