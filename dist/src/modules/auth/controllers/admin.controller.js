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
exports.AdminProfileController = exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const throttler_1 = require("@nestjs/throttler");
const files_interceptor_1 = require("../../../common/interceptors/files.interceptor");
const login_user_decorator_1 = require("../../../common/decorator/login-user.decorator");
const auth_service_1 = require("../auth.service");
const auth_dto_1 = require("../dto/auth.dto");
const role_decorator_1 = require("../../../common/decorator/role.decorator");
const user_role_enum_1 = require("../../../common/enum/user-role.enum");
const rbac_guard_1 = require("../../../common/guards/rbac.guard");
let AdminController = class AdminController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, dto) {
        return this.authService.adminLogin(req, dto);
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
    async logout(req, user) {
        const accessToken = req.headers.authorization.split(' ')[1];
        return this.authService.logout(user._id.toString(), accessToken);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.AdminLoginDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('refresh-token'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshJwtDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "refreshToken", null);
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
], AdminController.prototype, "profileDetails", null);
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
], AdminController.prototype, "logout", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('admin/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AdminController);
let AdminProfileController = class AdminProfileController {
    constructor(authService) {
        this.authService = authService;
    }
    async updateProfile(user, dto, files) {
        return this.authService.updateProfileDetails(user._id.toString(), dto, files);
    }
    async changePassword(user, dto) {
        return this.authService.changePassword(user._id.toString(), dto);
    }
};
exports.AdminProfileController = AdminProfileController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('update'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, files_interceptor_1.uploadSingleFileInterceptor)({ directory: 'users', fieldName: 'profileImage' })),
    (0, common_1.HttpCode)(200),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateAdminProfileDto, Array]),
    __metadata("design:returntype", Promise)
], AdminProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('change-password'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AdminProfileController.prototype, "changePassword", null);
exports.AdminProfileController = AdminProfileController = __decorate([
    (0, swagger_1.ApiTags)('Profile'),
    (0, common_1.Controller)('admin/profile'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AdminProfileController);
