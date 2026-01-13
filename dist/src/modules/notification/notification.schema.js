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
exports.NotificationSchema = exports.Notification = exports.NotificationAudience = exports.NotificationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var NotificationType;
(function (NotificationType) {
    NotificationType["GENERAL"] = "general";
    NotificationType["SYSTEM"] = "system";
    NotificationType["EVENT"] = "event";
    NotificationType["PROMOTION"] = "promotion";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationAudience;
(function (NotificationAudience) {
    NotificationAudience["ALL"] = "all";
    NotificationAudience["USERS"] = "users";
    NotificationAudience["ADMINS"] = "admins";
    NotificationAudience["CUSTOM"] = "custom";
})(NotificationAudience || (exports.NotificationAudience = NotificationAudience = {}));
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Notification.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: NotificationType,
        required: true,
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: NotificationAudience,
        required: true,
    }),
    __metadata("design:type", String)
], Notification.prototype, "audience", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        required: true,
        enum: ['fcm', 'sms', 'email'],
    }),
    __metadata("design:type", Array)
], Notification.prototype, "gateways", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Notification.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Object)
], Notification.prototype, "deliverAt", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
exports.NotificationSchema.index({ createdAt: -1 });
