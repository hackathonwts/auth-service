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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permission_dto_1 = require("../dto/permission.dto");
const passport_1 = require("@nestjs/passport");
const role_decorator_1 = require("../../../common/decorator/role.decorator");
const rbac_guard_1 = require("../../../common/guards/rbac.guard");
const user_role_enum_1 = require("../../../common/enum/user-role.enum");
const permission_service_1 = require("../permission.service");
let PermissionsController = class PermissionsController {
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    savePermission(dto) {
        return this.permissionsService.save(dto);
    }
    getAll(dto) {
        return this.permissionsService.getAll(dto);
    }
    findOne(id) {
        return this.permissionsService.get(id);
    }
    deletePermission(id) {
        return this.permissionsService.delete(id);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)(),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create permission' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_dto_1.SavePermissionDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "savePermission", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('getall'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Get all permissions' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_dto_1.PermissionListingDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(':id'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Get permission by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)(':id'),
    (0, role_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RBAcGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Delete permission' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "deletePermission", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Permissions'),
    (0, common_1.Controller)('admin/permissions'),
    __metadata("design:paramtypes", [permission_service_1.PermissionsService])
], PermissionsController);
