"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const rbac_guard_1 = require("../../../common/guards/rbac.guard");
const role_decorator_1 = require("../../../common/decorator/role.decorator");
const user_role_enum_1 = require("../../../common/enum/user-role.enum");
const mongoid_pipe_1 = require("../../../common/pipes/mongoid.pipe");
const notification_service_1 = require("../notification.service");
const login_user_decorator_1 = require("../../../common/decorator/login-user.decorator");
const notification_dto_1 = require("../notification.dto");
let UserNotificationController = class UserNotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotifications(params, user) {
        params.userId = user._id.toString();
        return this.notificationService.getNotifications(params);
    }
    async getNotification(id) {
        return this.notificationService.getNotification(id);
    }
    async markRead(user, notificationUserId) {
        return this.notificationService.markAsRead(user._id.toString(), notificationUserId);
    }
    async markAllRead(user) {
        return this.notificationService.markAllAsRead(user._id.toString());
    }
    async deleteNotification(user, notificationUserId) {
        return this.notificationService.deleteUserNotification(user._id, notificationUserId);
    }
    async deleteAllNotifications(user) {
        return this.notificationService.deleteAllUserNotifications(user._id);
    }
};
exports.UserNotificationController = UserNotificationController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notifications for the logged-in user' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, login_user_decorator_1.LoginUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.FilterNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], UserNotificationController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(':id'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification details for a user (via NotificationUser ID)' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id', new mongoid_pipe_1.MongoIdPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserNotificationController.prototype, "getNotification", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('read/:notificationUserId'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a notification as read/unread for logged-in user' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.Param)('notificationUserId', new mongoid_pipe_1.MongoIdPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserNotificationController.prototype, "markRead", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('read-all'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read for logged-in user' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserNotificationController.prototype, "markAllRead", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)(':notificationUserId'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Soft delete a notification for the user (via NotificationUser ID)',
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.Param)('notificationUserId', new mongoid_pipe_1.MongoIdPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserNotificationController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)(),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete all notifications for the logged-in user' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserNotificationController.prototype, "deleteAllNotifications", null);
exports.UserNotificationController = UserNotificationController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('notification'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], UserNotificationController);
