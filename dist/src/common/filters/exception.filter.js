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
exports.CustomExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const winston_logger_1 = require("../logger/winston.logger");
let CustomExceptionFilter = class CustomExceptionFilter {
    constructor() {
        this.winston = new winston_logger_1.WinstonLoggerService();
        this.configService = new config_1.ConfigService();
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const exceptionStatus = exception.getStatus ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception.getResponse ? exception.getResponse() : null;
        const data = {
            statusCode: exceptionStatus,
            success: false,
            message: exception?.message || exception,
            data: null,
            stack: this.configService.get('NODE_ENV') == 'development' ? exception.stack : null,
        };
        switch (exceptionStatus) {
            case common_1.HttpStatus.BAD_REQUEST:
                if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
                    const messages = Array.isArray(exceptionResponse['message']) ? exceptionResponse['message'] : [exceptionResponse['message']];
                    data.message = messages[0];
                }
                break;
            case common_1.HttpStatus.UNAUTHORIZED:
                data.message = 'Unauthorized';
                break;
            case common_1.HttpStatus.TOO_MANY_REQUESTS:
                data.message = 'Too Many Requests';
                break;
            default:
                break;
        }
        return response.status(exceptionStatus).json(data);
    }
};
exports.CustomExceptionFilter = CustomExceptionFilter;
exports.CustomExceptionFilter = CustomExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [])
], CustomExceptionFilter);
