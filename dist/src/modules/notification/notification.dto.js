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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationUserStatusDto = exports.FilterNotificationDto = exports.CreateNotificationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const notification_schema_1 = require("./notification.schema");
const swagger_1 = require("@nestjs/swagger");
class CreateNotificationDto {
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification title',
        example: 'New Feature Update!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification message body',
        example: 'We have released a new update with exciting features.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of notification',
        enum: notification_schema_1.NotificationType,
        example: notification_schema_1.NotificationType.GENERAL,
    }),
    (0, class_validator_1.IsEnum)(notification_schema_1.NotificationType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target audience for the notification',
        enum: notification_schema_1.NotificationAudience,
        example: notification_schema_1.NotificationAudience.ALL,
    }),
    (0, class_validator_1.IsEnum)(notification_schema_1.NotificationAudience),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "audience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User IDs (Required only when audience = CUSTOM)',
        type: [String],
        example: ['65c8a99e24a91c7ac9c9a012', '65c8a99e24a91c7ac9c9a013'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateNotificationDto.prototype, "userIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gateways for delivering the notification',
        isArray: true,
        enum: ['fcm', 'sms', 'email'],
        example: ['fcm', 'email'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateNotificationDto.prototype, "gateways", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata object (optional)',
        example: { orderId: '123456', priority: 'high' },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateNotificationDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Schedule date/time for delayed delivery',
        example: '2025-12-15T10:30:00.000Z',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value).toISOString() : value)),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "deliverAt", void 0);
class FilterNotificationDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.FilterNotificationDto = FilterNotificationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search by title/message',
        example: 'update',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterNotificationDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by notification type',
        enum: notification_schema_1.NotificationType,
        example: notification_schema_1.NotificationType.SYSTEM,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_schema_1.NotificationType),
    __metadata("design:type", String)
], FilterNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by audience type',
        enum: notification_schema_1.NotificationAudience,
        example: notification_schema_1.NotificationAudience.ALL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_schema_1.NotificationAudience),
    __metadata("design:type", String)
], FilterNotificationDto.prototype, "audience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by read/unread status',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterNotificationDto.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter notifications for single user',
        example: '65c8a99e24a91c7ac9c9a011',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        example: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilterNotificationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results per page',
        example: 10,
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilterNotificationDto.prototype, "limit", void 0);
class UpdateNotificationUserStatusDto {
}
exports.UpdateNotificationUserStatusDto = UpdateNotificationUserStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mark notification as read/unread',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], UpdateNotificationUserStatusDto.prototype, "isRead", void 0);
