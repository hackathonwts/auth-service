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
exports.AdminNotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const mongoid_pipe_1 = require("../../../common/pipes/mongoid.pipe");
const role_decorator_1 = require("../../../common/decorator/role.decorator");
const user_role_enum_1 = require("../../../common/enum/user-role.enum");
const rbac_guard_1 = require("../../../common/guards/rbac.guard");
const notification_dto_1 = require("../notification.dto");
const files_interceptor_1 = require("../../../common/interceptors/files.interceptor");
const notification_service_1 = require("../notification.service");
let AdminNotificationController = class AdminNotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotifications(params) {
        return this.notificationService.getNotifications(params);
    }
    async getNotification(id) {
        return this.notificationService.getNotification(id);
    }
    async createNotification(dto, files) {
        return this.notificationService.createNotification(dto, files);
    }
    async deleteNotification(id) {
        return this.notificationService.deleteNotification(id);
    }
};
exports.AdminNotificationController = AdminNotificationController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notifications' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.FilterNotificationDto]),
    __metadata("design:returntype", Promise)
], AdminNotificationController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(':id'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification details by ID' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id', new mongoid_pipe_1.MongoIdPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminNotificationController.prototype, "getNotification", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)(),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new notification' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notification created successfully' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, files_interceptor_1.uploadAnyFilesInterceptor)({ directory: 'notifications', storage: 'local' })),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.CreateNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], AdminNotificationController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)(':id'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete notification by ID' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id', new mongoid_pipe_1.MongoIdPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminNotificationController.prototype, "deleteNotification", null);
exports.AdminNotificationController = AdminNotificationController = __decorate([
    (0, swagger_1.ApiTags)('Admin Notifications Management'),
    (0, common_1.Controller)('admin/notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], AdminNotificationController);
