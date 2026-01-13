"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_strategy_1 = require("./strategy/auth.strategy");
const mongoose_1 = require("@nestjs/mongoose");
const auth_service_1 = require("./auth.service");
const refresh_token_schema_1 = require("../refresh-token/schemas/refresh-token.schema");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const admin_controller_1 = require("./controllers/admin.controller");
const user_controller_1 = require("./controllers/user.controller");
const queue_module_1 = require("../../common/queue/queue.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: refresh_token_schema_1.RefreshToken.name, schema: refresh_token_schema_1.RefreshTokenSchema }]),
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    privateKey: configService.getOrThrow('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            queue_module_1.QueueModule
        ],
        controllers: [user_controller_1.UserController, admin_controller_1.AdminController, admin_controller_1.AdminProfileController],
        providers: [auth_service_1.AuthService, auth_strategy_1.JwtStrategy],
        exports: [auth_strategy_1.JwtStrategy],
    })
], AuthModule);
