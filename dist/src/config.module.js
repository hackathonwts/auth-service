"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfigModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const node_fs_1 = require("node:fs");
let ApiConfigModule = class ApiConfigModule {
};
exports.ApiConfigModule = ApiConfigModule;
exports.ApiConfigModule = ApiConfigModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: (() => {
                    const env = process.env.NODE_ENV;
                    let envFile = '.env';
                    if (env) {
                        envFile = `.env.${env}`;
                        common_1.Logger.log(`Using environment-specific file: ${envFile}`, 'ConfigModule');
                    }
                    else {
                        envFile = '.env.production';
                        common_1.Logger.log(`No NODE_ENV set, defaulting to: ${envFile}`, 'ConfigModule');
                    }
                    common_1.Logger.log(`Checking if file exists: ${envFile}`, 'ConfigModule');
                    if (!(0, node_fs_1.existsSync)(envFile)) {
                        common_1.Logger.error(`Environment file '${envFile}' not found. Please create the file or set NODE_ENV to a valid environment.`, 'ConfigModule');
                        process.exit(1);
                    }
                    common_1.Logger.log(`Environment file '${envFile}' loaded successfully`, 'ConfigModule');
                    return envFile;
                })(),
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: (configService) => ({
                    uri: configService.getOrThrow('MONGO_URI'),
                    dbName: configService.getOrThrow('DB_DATABASE'),
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
        ],
        providers: [
            common_1.Logger
        ],
    })
], ApiConfigModule);
