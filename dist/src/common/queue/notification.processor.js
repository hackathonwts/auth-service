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
var NotificationProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProcessor = void 0;
const notification_helper_1 = require("../../helpers/notification.helper");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
let NotificationProcessor = NotificationProcessor_1 = class NotificationProcessor extends bullmq_1.WorkerHost {
    constructor(notificationHelper) {
        super();
        this.notificationHelper = notificationHelper;
        this.logger = new common_1.Logger(NotificationProcessor_1.name);
    }
    async process(job) {
        switch (job.name) {
            case 'send-notification':
                return this.handleSend(job);
            case 'broadcast-notification':
                return this.handleBroadcast(job);
            default:
                this.logger.error(`Unknown job: ${job.name}`);
        }
    }
    async handleSend(job) {
        const { title, message, gateways } = job.data;
        const { notificationContacts } = await this.notificationHelper.processNotification(job.data);
        if (gateways.includes('fcm') && notificationContacts.fcmTokens.length) {
            await this.processFcm(notificationContacts.fcmTokens, title, message);
        }
        if (gateways.includes('email') && notificationContacts.emails.length) {
            await this.notificationHelper.sendBulkEmails(notificationContacts.emails, title, message);
        }
        if (gateways.includes('sms') && notificationContacts.phones.length) {
            await this.notificationHelper.sendBulkSms(notificationContacts.phones, message);
        }
    }
    async handleBroadcast(job) {
        const { title, message, gateways } = job.data;
        if (gateways.includes('fcm'))
            await this.notificationHelper.broadcastFcm(title, message);
        if (gateways.includes('email'))
            await this.notificationHelper.broadcastEmail(title, message);
        if (gateways.includes('sms'))
            await this.notificationHelper.broadcastSms(message);
        return { broadcast: true };
    }
    async processFcm(tokens, title, message) {
        if (!tokens.length)
            return;
        const BATCH = 500;
        for (let i = 0; i < tokens.length; i += BATCH) {
            const batch = tokens.slice(i, i + BATCH);
            await this.notificationHelper.sendFcmBatch(batch, title, message);
        }
    }
    onCompleted(job) {
        this.logger.log(`Job completed: ${job.name}`);
    }
};
exports.NotificationProcessor = NotificationProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], NotificationProcessor.prototype, "onCompleted", null);
exports.NotificationProcessor = NotificationProcessor = NotificationProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('notification-queue'),
    __metadata("design:paramtypes", [notification_helper_1.NotificationHelper])
], NotificationProcessor);
