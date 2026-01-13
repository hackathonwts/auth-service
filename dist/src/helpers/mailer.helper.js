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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerHelper = void 0;
const common_1 = require("@nestjs/common");
const node_path_1 = require("node:path");
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = __importDefault(require("email-templates"));
const config_1 = require("@nestjs/config");
const smtp_transport_1 = __importDefault(require("nodemailer/lib/smtp-transport"));
let MailerHelper = class MailerHelper {
    constructor(configService) {
        this.configService = configService;
    }
    async sendMail(option) {
        const { from, to, subject, template, locals } = option;
        const templateDir = (0, node_path_1.resolve)('./views/', 'email-templates', template, 'html');
        const email = new email_templates_1.default({
            views: {
                root: templateDir,
                options: {
                    extension: 'ejs',
                },
            },
        });
        const getMailBody = await email.render(templateDir, locals);
        const transporter = nodemailer_1.default.createTransport(new smtp_transport_1.default({
            host: this.configService.getOrThrow('MAIL_HOST'),
            port: Number.parseInt(this.configService.getOrThrow('MAIL_PORT')),
            secure: this.configService.getOrThrow('MAIL_SECURE') === 'true',
            auth: {
                user: this.configService.getOrThrow('MAIL_USERNAME'),
                pass: this.configService.getOrThrow('MAIL_PASSWORD'),
            },
            tls: {
                rejectUnauthorized: false,
            },
        }));
        const mailOptions = {
            from,
            to,
            subject,
            html: getMailBody,
        };
        return await transporter.sendMail(mailOptions);
    }
};
exports.MailerHelper = MailerHelper;
exports.MailerHelper = MailerHelper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerHelper);
