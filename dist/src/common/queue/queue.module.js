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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const api_1 = require("@bull-board/api");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const express_1 = require("@bull-board/express");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const mailer_helper_1 = require("../../helpers/mailer.helper");
const notification_helper_1 = require("../../helpers/notification.helper");
const mail_processor_1 = require("./mail.processor");
const notification_processor_1 = require("./notification.processor");
const email_gateway_1 = require("../../config/gateways/email.gateway");
const fcm_gateway_1 = require("../../config/gateways/fcm.gateway");
const sms_gateway_1 = require("../../config/gateways/sms.gateway");
const leaderboard_processor_1 = require("./leaderboard.processor");
let QueueModule = class QueueModule {
    constructor(mailQueue, notificationQueue, reportQueue, leaderboardQueue) {
        this.mailQueue = mailQueue;
        this.notificationQueue = notificationQueue;
        this.reportQueue = reportQueue;
        this.leaderboardQueue = leaderboardQueue;
        this.serverAdapter = new express_1.ExpressAdapter();
    }
    onModuleInit() {
        this.serverAdapter.setBasePath('/admin/queues');
        (0, api_1.createBullBoard)({
            queues: [new bullMQAdapter_1.BullMQAdapter(this.mailQueue), new bullMQAdapter_1.BullMQAdapter(this.notificationQueue), new bullMQAdapter_1.BullMQAdapter(this.reportQueue), new bullMQAdapter_1.BullMQAdapter(this.leaderboardQueue)],
            serverAdapter: this.serverAdapter,
        });
    }
    setupBullBoard(app) {
        app.use('/admin/queues', (0, express_basic_auth_1.default)({
            users: { admin: process.env.BULLBOARD_PASSWORD || 'secret123' },
            challenge: true,
            unauthorizedResponse: () => 'Unauthorized',
        }), this.serverAdapter.getRouter());
    }
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'notification-queue',
                defaultJobOptions: {
                    attempts: 5,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                    removeOnComplete: true,
                    removeOnFail: false,
                },
            }, {
                name: 'mail-queue',
                defaultJobOptions: {
                    removeOnComplete: true,
                    attempts: 3,
                },
            }, {
                name: 'report-queue',
                defaultJobOptions: {
                    removeOnComplete: true,
                },
            }, {
                name: 'leaderboard-queue',
                defaultJobOptions: {
                    removeOnComplete: true,
                },
            }),
        ],
        providers: [mail_processor_1.MailProcessor, mailer_helper_1.MailerHelper, notification_processor_1.NotificationProcessor, notification_helper_1.NotificationHelper, fcm_gateway_1.FcmGateway, sms_gateway_1.SmsGateway, email_gateway_1.EmailGateway, leaderboard_processor_1.LeaderboardProcessor],
        exports: [bullmq_1.BullModule],
    }),
    __param(0, (0, bullmq_1.InjectQueue)('mail-queue')),
    __param(1, (0, bullmq_1.InjectQueue)('notification-queue')),
    __param(2, (0, bullmq_1.InjectQueue)('report-queue')),
    __param(3, (0, bullmq_1.InjectQueue)('leaderboard-queue')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue])
], QueueModule);
