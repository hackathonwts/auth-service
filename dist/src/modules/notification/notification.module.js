"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_controller_1 = require("./controllers/admin.controller");
const notification_service_1 = require("./notification.service");
const notification_schema_1 = require("./notification.schema");
const user_controller_1 = require("./controllers/user.controller");
const queue_module_1 = require("../../common/queue/queue.module");
const notification_repository_1 = require("./notification.repository");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: notification_schema_1.Notification.name,
                    useFactory: () => {
                        const schema = notification_schema_1.NotificationSchema;
                        return schema;
                    },
                },
            ]),
            queue_module_1.QueueModule,
        ],
        controllers: [admin_controller_1.AdminNotificationController, user_controller_1.UserNotificationController],
        providers: [notification_service_1.NotificationService, notification_repository_1.NotificationRepository],
        exports: [notification_service_1.NotificationService, notification_repository_1.NotificationRepository],
    })
], NotificationModule);
