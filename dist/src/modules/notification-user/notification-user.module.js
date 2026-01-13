"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationUserModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const notification_user_schema_1 = require("./notification-user.schema");
const notification_user_repository_1 = require("./notification-user.repository");
let NotificationUserModule = class NotificationUserModule {
};
exports.NotificationUserModule = NotificationUserModule;
exports.NotificationUserModule = NotificationUserModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: notification_user_schema_1.NotificationUser.name,
                    useFactory: () => {
                        const schema = notification_user_schema_1.NotificationUserSchema;
                        return schema;
                    },
                },
            ]),
        ],
        controllers: [],
        providers: [notification_user_repository_1.NotificationUserRepository],
        exports: [notification_user_repository_1.NotificationUserRepository],
    })
], NotificationUserModule);
