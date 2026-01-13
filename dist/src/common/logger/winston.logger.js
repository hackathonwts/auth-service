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
exports.WinstonLoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const path_1 = require("path");
require("winston-daily-rotate-file");
let WinstonLoggerService = class WinstonLoggerService {
    constructor() {
        const defaultFormat = winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json());
        this.logger = (0, winston_1.createLogger)({
            level: 'error',
            format: defaultFormat,
            transports: [
                new winston_1.transports.DailyRotateFile({
                    filename: (0, path_1.join)('./logs', 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '10m',
                    maxFiles: '7d',
                    handleExceptions: true,
                }),
            ],
        });
    }
    error(message, trace) {
        this.logger.error(message, { trace });
    }
    debug(message, trace) {
        this.logger.debug(message, { trace });
    }
};
exports.WinstonLoggerService = WinstonLoggerService;
exports.WinstonLoggerService = WinstonLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WinstonLoggerService);
