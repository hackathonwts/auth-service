"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsGateway = void 0;
const common_1 = require("@nestjs/common");
const twilio_1 = __importDefault(require("twilio"));
let SmsGateway = class SmsGateway {
    constructor() {
        this.client = (0, twilio_1.default)(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    }
    async sendSMS(phone, message) {
        return this.client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to: phone,
        });
    }
    async sendBulkSms(phones, message) {
        const jobs = phones.map((phone) => this.sendSMS(phone, message));
        return Promise.allSettled(jobs);
    }
    async broadcast(message) {
        console.log('Broadcasting SMS to all users:', message);
    }
};
exports.SmsGateway = SmsGateway;
exports.SmsGateway = SmsGateway = __decorate([
    (0, common_1.Injectable)()
], SmsGateway);
