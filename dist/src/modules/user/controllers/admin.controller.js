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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const user_dto_1 = require("../user.dto");
const files_interceptor_1 = require("../../../common/interceptors/files.interceptor");
const mongoid_pipe_1 = require("../../../common/pipes/mongoid.pipe");
const role_decorator_1 = require("../../../common/decorator/role.decorator");
const user_role_enum_1 = require("../../../common/enum/user-role.enum");
const rbac_guard_1 = require("../../../common/guards/rbac.guard");
const user_service_1 = require("../user.service");
let AdminController = class AdminController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUsers(dto) {
        return this.userService.getUsers(dto);
    }
    async createUser(dto, files) {
        return this.userService.createUser(dto, files);
    }
    async getUser(userId) {
        return this.userService.getUser(userId);
    }
    async updateUserProfile(userId, dto, files) {
        return this.userService.updateUser(userId, dto, files);
    }
    async updateUserStatus(userId, dto) {
        return this.userService.updateStatus(userId, dto);
    }
    async resetUserPassword(userId, dto) {
        return this.userService.resetPassword(userId, dto);
    }
    async deleteUser(userId) {
        return this.userService.deleteUser(userId);
    }
    async deleteUsers(dto) {
        return this.userService.deleteUsers(dto.userIds);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('list'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.ListingUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, files_interceptor_1.uploadSingleFileInterceptor)({ directory: 'users', fieldName: 'profileImage' })),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto, Array]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('details/:userId'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('userId', new mongoid_pipe_1.MongoIdPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('update-profile/:userId'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, files_interceptor_1.uploadSingleFileInterceptor)({ directory: 'users', fieldName: 'profileImage' })),
    __param(0, (0, common_1.Param)('userId', new mongoid_pipe_1.MongoIdPipe())),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserDto, Array]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('update-status/:userId'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('userId', new mongoid_pipe_1.MongoIdPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('reset-password/:userId'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('userId', new mongoid_pipe_1.MongoIdPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserPasswordDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetUserPassword", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)('delete/:userId'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('userId', new mongoid_pipe_1.MongoIdPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('delete-multiple'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.ADMINISTRATOR),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUsers", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('User Management'),
    (0, common_1.Controller)('admin/user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AdminController);
