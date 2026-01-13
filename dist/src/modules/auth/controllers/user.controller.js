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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const throttler_1 = require("@nestjs/throttler");
const files_interceptor_1 = require("../../../common/interceptors/files.interceptor");
const login_user_decorator_1 = require("../../../common/decorator/login-user.decorator");
const auth_service_1 = require("../auth.service");
const auth_dto_1 = require("../dto/auth.dto");
let UserController = class UserController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(req, dto, files) {
        return this.authService.userSignup(dto, files, req);
    }
    async resendOtp(dto) {
        return this.authService.resendOtp(dto);
    }
    async verifyEmail(req, dto) {
        return this.authService.verifyOtp(dto, req);
    }
    async googleSocialAuth(dto, req) {
        return this.authService.socialLoginGoogle(req, dto.idToken);
    }
    async facebookSocialAuth(dto, req) {
        return this.authService.socialLoginFacebook(req, dto.accessToken);
    }
    async appleSocialAuth(dto, req) {
        return this.authService.socialLoginApple(req, dto);
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto);
    }
    async refreshToken(dto) {
        return this.authService.refreshToken(dto);
    }
    async profileDetails(user) {
        return this.authService.getProfileDetails(user._id.toString());
    }
    async onboarding(user, dto, files) {
        return this.authService.onboarding(user._id.toString(), dto, files);
    }
    async deleteAccount(user) {
        return this.authService.deleteAccount(user._id.toString());
    }
    async logout(req, user) {
        const accessToken = req.headers.authorization.split(' ')[1];
        return this.authService.logout(user._id.toString(), accessToken);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('register'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiConsumes)('application/json', 'multipart/form-data'),
    (0, common_1.UseInterceptors)((0, files_interceptor_1.uploadSingleFileInterceptor)({ directory: 'users', fieldName: 'profileImage' })),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.SignupDto, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('resend-otp'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiConsumes)('application/json'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResendOTPDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('verify-otp'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.VerifyOTPDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('google-social-auth'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.GoogleSocialAuthDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "googleSocialAuth", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('facebook-social-auth'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.FacebookSocialAuthDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "facebookSocialAuth", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('apple-social-auth'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AppleSocialAuthDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "appleSocialAuth", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('refresh-token'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshJwtDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "profileDetails", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('onboarding'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseInterceptors)((0, files_interceptor_1.uploadMultiFileInterceptor)({
        fileFields: [
            { name: 'mainPhoto', directory: 'users', maxCount: 1 },
            { name: 'galleryPhotos', directory: 'gallery', maxCount: 5 },
        ],
    })),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UserOnboardingDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "onboarding", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)('delete-account'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('logout'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, login_user_decorator_1.LoginUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], UserController);
