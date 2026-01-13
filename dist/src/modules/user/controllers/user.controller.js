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
const user_service_1 = require("../user.service");
const role_decorator_1 = require("../../../common/decorator/role.decorator");
const user_role_enum_1 = require("../../../common/enum/user-role.enum");
const rbac_guard_1 = require("../../../common/guards/rbac.guard");
const login_user_decorator_1 = require("../../../common/decorator/login-user.decorator");
const files_interceptor_1 = require("../../../common/interceptors/files.interceptor");
const passport_1 = require("@nestjs/passport");
const auth_dto_1 = require("../../auth/dto/auth.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async updateProfile(user, dto, files) {
        return this.userService.updateProfile(user._id.toString(), dto, files);
    }
    async updateSettings(user, dto) {
        return this.userService.updateSettings(user._id.toString(), dto);
    }
    async changePassword(user, dto) {
        return this.userService.changePassword(user._id.toString(), dto);
    }
    async getGalleryImages(user) {
        return this.userService.getGalleryImages(user._id.toString());
    }
    async deleteGalleryImage(user, imageId) {
        return this.userService.deleteGalleryImage(user._id.toString(), imageId);
    }
    async addGalleryImages(user, files) {
        return this.userService.addGalleryImages(user._id.toString(), files);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('update-profile'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, files_interceptor_1.uploadSingleFileInterceptor)({ directory: 'users', fieldName: 'profileImage' })),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateUserProfileDto, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('update-settings'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('application/json'),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateSettingsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('change-password'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('gallery-images'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getGalleryImages", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('delete-gallery-image/:imageId'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.Body)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteGalleryImage", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('add-gallery-images'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.USER),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, files_interceptor_1.uploadAnyFilesInterceptor)({ directory: 'gallery' })),
    __param(0, (0, login_user_decorator_1.LoginUser)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addGalleryImages", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Profile'),
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
