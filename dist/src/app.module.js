"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const helpers_module_1 = require("./helpers/helpers.module");
const refresh_token_module_1 = require("./modules/refresh-token/refresh-token.module");
const role_module_1 = require("./modules/role/role.module");
const user_device_repository_module_1 = require("./modules/user-devices/repository/user-device-repository.module");
const user_module_1 = require("./modules/user/user.module");
const cms_module_1 = require("./modules/cms/cms.module");
const cms_repository_module_1 = require("./modules/cms/repositories/cms.repository.module");
const role_repository_module_1 = require("./modules/role/repositories/role.repository.module");
const config_module_1 = require("./config.module");
const auth_module_1 = require("./modules/auth/auth.module");
const queue_module_1 = require("./common/queue/queue.module");
const redis_module_1 = require("./common/redis/redis.module");
const bullmq_1 = require("@nestjs/bullmq");
const notification_module_1 = require("./modules/notification/notification.module");
const notification_user_module_1 = require("./modules/notification-user/notification-user.module");
const media_module_1 = require("./modules/media/media.module");
const permission_module_1 = require("./modules/permission/permission.module");
const pemission_repository_module_1 = require("./modules/permission/repositories/pemission.repository.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ApiConfigModule,
            helpers_module_1.HelpersModule,
            redis_module_1.RedisModule,
            bullmq_1.BullModule.forRootAsync({
                useFactory: (redis) => ({
                    connection: redis,
                }),
                inject: ['REDIS_CONNECTION'],
            }),
            queue_module_1.QueueModule,
            media_module_1.MediaModule,
            auth_module_1.AuthModule,
            refresh_token_module_1.RefreshTokenModule,
            role_module_1.RoleModule,
            user_device_repository_module_1.UserDeviceRepositoryModule,
            user_module_1.UsersModule,
            cms_module_1.CmsModule,
            cms_repository_module_1.CmsRepositoryModule,
            role_repository_module_1.RoleRepositoryModule,
            notification_module_1.NotificationModule,
            notification_user_module_1.NotificationUserModule,
            permission_module_1.PermissionsModule,
            pemission_repository_module_1.PermissionRepositoryModule,
        ],
        providers: [],
    })
], AppModule);
