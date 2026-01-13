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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const user_repository_1 = require("../../user/user.repository");
const user_device_repository_1 = require("../../user-devices/repository/user-device.repository");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(configService, userRepository, userDeviceRepository) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('JWT_SECRET'),
            passReqToCallback: true,
        });
        this.configService = configService;
        this.userRepository = userRepository;
        this.userDeviceRepository = userDeviceRepository;
    }
    async validate(req, payload, done) {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const tokenData = await this.userDeviceRepository.getByField({
            accessToken: token,
            expired: false,
            isLoggedOut: false,
            isDeleted: false,
        });
        const lastSegment = req.originalUrl.split('/').pop();
        if (tokenData?._id || lastSegment === 'logout') {
            const { userId } = payload;
            const user = await this.userRepository.getUserDetails(userId);
            if (!user)
                return done(new common_1.UnauthorizedException(), false);
            return done(null, user, payload.iat);
        }
        else {
            throw new common_1.UnauthorizedException('Token has been invalidated. Please log in again.');
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_repository_1.UserRepository,
        user_device_repository_1.UserDeviceRepository])
], JwtStrategy);
