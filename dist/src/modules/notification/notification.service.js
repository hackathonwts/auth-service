"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = __importStar(require("mongoose"));
const messages_1 = require("../../common/constants/messages");
const response_helper_1 = require("../../helpers/response.helper");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const notification_repository_1 = require("./notification.repository");
const notification_user_repository_1 = require("../notification-user/notification-user.repository");
let NotificationService = class NotificationService {
    constructor(notificationQueue, notificationRepository, notificationUserRepository) {
        this.notificationQueue = notificationQueue;
        this.notificationRepository = notificationRepository;
        this.notificationUserRepository = notificationUserRepository;
    }
    async getNotifications(dto) {
        const notifications = await this.notificationRepository.getAll(dto);
        return (0, response_helper_1.successResponse)(notifications, 'Notification list fetched successfully.');
    }
    async getNotification(id) {
        const notification = await this.notificationRepository.getByField({
            _id: new mongoose_1.default.Types.ObjectId(id),
            isDeleted: false,
        });
        if (!notification)
            throw new common_1.NotFoundException('Notification not found!');
        return (0, response_helper_1.successResponse)(notification.toObject(), 'Notification details retrieved successfully.');
    }
    async createNotification(body, files) {
        try {
            if (files && Object.keys(files).length > 0) {
                if (files['thumbnail']) {
                    body.thumbnail = files['thumbnail'][0].location;
                }
                if (files['files']) {
                    body['attachments'] = files['files'].map((f) => f.location);
                }
            }
            const notification = await this.notificationRepository.save(body);
            if (!notification)
                throw new common_1.BadRequestException(messages_1.Messages.SOMETHING_WENT_WRONG);
            const notificationPayload = { ...body, notificationId: notification._id };
            if (notificationPayload.deliverAt) {
                await this.notificationQueue.add('broadcast-notification', notificationPayload, { delay: new Date(body.deliverAt).getTime() - Date.now() });
            }
            else {
                await this.notificationQueue.add('send-notification', notificationPayload);
            }
            return (0, response_helper_1.successResponse)(notification, 'Notification created successfully.');
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || messages_1.Messages.SOMETHING_WENT_WRONG);
        }
    }
    async deleteNotification(id) {
        const deletedNotification = await this.notificationRepository.delete(new mongoose_1.Types.ObjectId(id));
        if (deletedNotification instanceof Error) {
            throw new common_1.BadRequestException(deletedNotification.message);
        }
        await this.notificationUserRepository.bulkDelete({ notification_id: new mongoose_1.Types.ObjectId(id) });
        if (!deletedNotification) {
            throw new common_1.BadRequestException(deletedNotification instanceof Error ? deletedNotification.message : messages_1.Messages.SOMETHING_WENT_WRONG);
        }
        return (0, response_helper_1.successResponse)(null, 'Notification deleted successfully.');
    }
    async markAsRead(userId, notificationUserId) {
        const result = await this.notificationUserRepository.updateByField({ isRead: true }, { _id: new mongoose_1.Types.ObjectId(notificationUserId), user_id: new mongoose_1.Types.ObjectId(userId), isDeleted: false });
        if (!result) {
            throw new common_1.BadRequestException(result instanceof Error ? result.message : messages_1.Messages.SOMETHING_WENT_WRONG);
        }
        return (0, response_helper_1.successResponse)(null, 'Notification marked as read successfully.');
    }
    async markAllAsRead(userId) {
        const result = await this.notificationUserRepository.updateAllByParams({ isRead: true }, { user_id: new mongoose_1.Types.ObjectId(userId), isDeleted: false });
        if (!result) {
            throw new common_1.BadRequestException(result instanceof Error ? result.message : messages_1.Messages.SOMETHING_WENT_WRONG);
        }
        return (0, response_helper_1.successResponse)(null, 'All notifications marked as read successfully.');
    }
    async deleteUserNotification(userId, notificationUserId) {
        const notificationUser = await this.notificationUserRepository.getByField({ _id: new mongoose_1.Types.ObjectId(notificationUserId), user_id: userId });
        if (!notificationUser) {
            throw new common_1.NotFoundException('NotificationUser not found for the user!');
        }
        const result = await this.notificationUserRepository.delete(new mongoose_1.Types.ObjectId(notificationUserId));
        if (!result) {
            throw new common_1.BadRequestException(result instanceof Error ? result.message : messages_1.Messages.SOMETHING_WENT_WRONG);
        }
        return (0, response_helper_1.successResponse)(null, 'User notification deleted successfully.');
    }
    async deleteAllUserNotifications(userId) {
        const result = await this.notificationUserRepository.bulkDelete({ user_id: userId });
        if (!result) {
            throw new common_1.BadRequestException(result instanceof Error ? result.message : messages_1.Messages.SOMETHING_WENT_WRONG);
        }
        return (0, response_helper_1.successResponse)(null, 'All user notifications deleted successfully.');
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('notification-queue')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        notification_repository_1.NotificationRepository,
        notification_user_repository_1.NotificationUserRepository])
], NotificationService);
