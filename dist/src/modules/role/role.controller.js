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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const role_dto_1 = require("./dto/role.dto");
const mongoid_pipe_1 = require("../../common/pipes/mongoid.pipe");
const role_service_1 = require("./role.service");
let RoleController = class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async saveRole(dto) {
        return this.roleService.save(dto);
    }
    async getRole(id) {
        return this.roleService.get(id);
    }
    async updateRole(id, dto) {
        return this.roleService.update(id, dto);
    }
    async statusChange(id, dto) {
        return this.roleService.statusUpdate(id, dto);
    }
    async deleteRole(id) {
        return this.roleService.delete(id);
    }
    async getAllRole(dto) {
        return this.roleService.getAll(dto);
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.SaveRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "saveRole", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id', new mongoid_pipe_1.MongoIdPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getRole", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', new mongoid_pipe_1.MongoIdPipe())),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('status-change/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id', new mongoid_pipe_1.MongoIdPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, role_dto_1.StatusRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "statusChange", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id', new mongoid_pipe_1.MongoIdPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('getall'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.RoleListingDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getAllRole", null);
exports.RoleController = RoleController = __decorate([
    (0, swagger_1.ApiTags)('Role'),
    (0, common_1.Controller)('admin/role'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
