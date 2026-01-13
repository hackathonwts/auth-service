"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpersModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_helper_1 = require("./mailer.helper");
const notification_helper_1 = require("./notification.helper");
const email_gateway_1 = require("../config/gateways/email.gateway");
const fcm_gateway_1 = require("../config/gateways/fcm.gateway");
const sms_gateway_1 = require("../config/gateways/sms.gateway");
let HelpersModule = class HelpersModule {
};
exports.HelpersModule = HelpersModule;
exports.HelpersModule = HelpersModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
        providers: [mailer_helper_1.MailerHelper, notification_helper_1.NotificationHelper, fcm_gateway_1.FcmGateway, sms_gateway_1.SmsGateway, email_gateway_1.EmailGateway],
        exports: [mailer_helper_1.MailerHelper, notification_helper_1.NotificationHelper, fcm_gateway_1.FcmGateway, sms_gateway_1.SmsGateway, email_gateway_1.EmailGateway],
    })
], HelpersModule);
