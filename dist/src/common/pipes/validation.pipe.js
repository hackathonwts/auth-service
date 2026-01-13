"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class ApiValidationPipe extends common_1.ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            errorHttpStatusCode: common_1.HttpStatus.BAD_REQUEST
        });
    }
}
exports.ApiValidationPipe = ApiValidationPipe;
