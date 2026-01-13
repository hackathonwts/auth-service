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
var NotificationHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationHelper = void 0;
const status_enum_1 = require("../common/enum/status.enum");
const email_gateway_1 = require("../config/gateways/email.gateway");
const fcm_gateway_1 = require("../config/gateways/fcm.gateway");
const sms_gateway_1 = require("../config/gateways/sms.gateway");
const notification_user_repository_1 = require("../modules/notification-user/notification-user.repository");
const notification_schema_1 = require("../modules/notification/notification.schema");
const user_device_repository_1 = require("../modules/user-devices/repository/user-device.repository");
const user_repository_1 = require("../modules/user/user.repository");
const common_1 = require("@nestjs/common");
let NotificationHelper = NotificationHelper_1 = class NotificationHelper {
    constructor(fcm, sms, email, userRepository, userDeviceRepository, notificationUserRepository) {
        this.fcm = fcm;
        this.sms = sms;
        this.email = email;
        this.userRepository = userRepository;
        this.userDeviceRepository = userDeviceRepository;
        this.notificationUserRepository = notificationUserRepository;
        this.logger = new common_1.Logger(NotificationHelper_1.name);
    }
    async processNotification(payload) {
        const { notificationId, audience, userIds } = payload;
        let registeredUserIds = [];
        const notificationContacts = {
            fcmTokens: [],
            emails: [],
            phones: [],
        };
        this.logger.log(`Processing audience: ${audience}`);
        if (audience === notification_schema_1.NotificationAudience.ALL) {
            const devices = await this.userDeviceRepository.getAllByField({ isLoggedOut: false });
            for (const d of devices) {
                if (d.deviceToken)
                    notificationContacts.fcmTokens.push(d.deviceToken);
            }
            const uniqueRegisteredIds = [...new Set(devices.filter((d) => d.user_id).map((d) => d.user_id.toString()))];
            registeredUserIds = uniqueRegisteredIds;
            const users = await this.userRepository.getAllByField({
                _id: { $in: uniqueRegisteredIds },
                isDeleted: false,
                status: status_enum_1.StatusEnum.Active,
            });
            for (const u of users) {
                if (u.email)
                    notificationContacts.emails.push(u.email);
                if (u.phone)
                    notificationContacts.phones.push(u.phone);
            }
        }
        else if (audience === notification_schema_1.NotificationAudience.ADMINS) {
            const adminUsers = await this.userRepository.getAllByField({
                role: 'admin',
                isDeleted: false,
                status: status_enum_1.StatusEnum.Active,
            });
            registeredUserIds = adminUsers.map((u) => u._id.toString());
            for (const u of adminUsers) {
                if (u.email)
                    notificationContacts.emails.push(u.email);
                if (u.phone)
                    notificationContacts.phones.push(u.phone);
            }
            const adminDevices = await this.userDeviceRepository.getAllByField({
                user_id: { $in: registeredUserIds },
                isLoggedOut: false,
            });
            for (const d of adminDevices) {
                if (d.deviceToken)
                    notificationContacts.fcmTokens.push(d.deviceToken);
            }
        }
        else if (audience === notification_schema_1.NotificationAudience.USERS) {
            const normalUsers = await this.userRepository.getAllByField({
                role: 'user',
                isDeleted: false,
                status: status_enum_1.StatusEnum.Active,
            });
            registeredUserIds = normalUsers.map((u) => u._id.toString());
            for (const u of normalUsers) {
                if (u.email)
                    notificationContacts.emails.push(u.email);
                if (u.phone)
                    notificationContacts.phones.push(u.phone);
            }
            const userDevices = await this.userDeviceRepository.getAllByField({
                user_id: { $in: registeredUserIds },
                isLoggedOut: false,
            });
            for (const d of userDevices) {
                if (d.deviceToken)
                    notificationContacts.fcmTokens.push(d.deviceToken);
            }
        }
        else if (audience === notification_schema_1.NotificationAudience.CUSTOM) {
            const selectedUsers = await this.userRepository.getAllByField({
                _id: { $in: userIds },
                isDeleted: false,
                status: status_enum_1.StatusEnum.Active,
            });
            registeredUserIds = selectedUsers.map((u) => u._id.toString());
            for (const u of selectedUsers) {
                if (u.email)
                    notificationContacts.emails.push(u.email);
                if (u.phone)
                    notificationContacts.phones.push(u.phone);
            }
            const devices = await this.userDeviceRepository.getAllByField({
                user_id: { $in: registeredUserIds },
                isLoggedOut: false,
            });
            for (const d of devices) {
                if (d.deviceToken)
                    notificationContacts.fcmTokens.push(d.deviceToken);
            }
        }
        else {
            this.logger.warn(`Invalid audience type:`, audience);
        }
        if (registeredUserIds.length) {
            await this.notificationUserRepository.saveMany(registeredUserIds.map((uid) => ({
                notificationId,
                userId: uid,
                isRead: false,
                status: 'pending',
            })));
            this.logger.log(`Stored ${registeredUserIds.length} notification-user records.`);
        }
        return {
            notificationContacts,
        };
    }
    async sendFcmBatch(tokens, title, message) {
        if (!tokens.length)
            return;
        const response = await this.fcm.sendMulticast(tokens, title, message);
        if (response.failureCount > 0) {
            const failedTokens = [];
            for (const [idx, res] of response.responses.entries()) {
                if (!res.success)
                    failedTokens.push(tokens[idx]);
            }
            if (failedTokens.length) {
                this.logger.warn(`Found invalid FCM tokens: ${failedTokens.length}`);
                await this.userDeviceRepository.bulkDelete(failedTokens);
            }
        }
        return response;
    }
    async sendBulkEmails(emails, title, message) {
        if (!emails.length)
            return;
        const tpl = {
            from: process.env.MAIL_FROM,
            to: undefined,
            subject: title,
            template: 'notification',
            locals: { title, message },
        };
        const CHUNK = 200;
        for (let i = 0; i < emails.length; i += CHUNK) {
            const batch = emails.slice(i, i + CHUNK);
            await this.email.sendBulkEmail(batch, tpl);
        }
    }
    async sendBulkSms(phones, message) {
        if (!phones.length)
            return;
        const CHUNK = 100;
        for (let i = 0; i < phones.length; i += CHUNK) {
            const batch = phones.slice(i, i + CHUNK);
            await this.sms.sendBulkSms(batch, message);
        }
    }
    async broadcast(payload) {
        const { gateways, title, message } = payload;
        const promises = [];
        if (gateways.includes('fcm')) {
            promises.push(this.broadcastFcm(title, message));
        }
        if (gateways.includes('sms')) {
            promises.push(this.broadcastSms(message));
        }
        if (gateways.includes('email')) {
            promises.push(this.broadcastEmail(title, message));
        }
        return Promise.all(promises);
    }
    async broadcastFcm(title, message) {
        return this.fcm.broadcast(title, message);
    }
    async broadcastEmail(title, message) {
        return this.email.broadcast(title, message);
    }
    async broadcastSms(message) {
        return this.sms.broadcast(message);
    }
};
exports.NotificationHelper = NotificationHelper;
exports.NotificationHelper = NotificationHelper = NotificationHelper_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fcm_gateway_1.FcmGateway,
        sms_gateway_1.SmsGateway,
        email_gateway_1.EmailGateway,
        user_repository_1.UserRepository,
        user_device_repository_1.UserDeviceRepository,
        notification_user_repository_1.NotificationUserRepository])
], NotificationHelper);
