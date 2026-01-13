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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const permission_repository_1 = require("./repositories/permission.repository");
const permission_dto_1 = require("./dto/permission.dto");
const messages_1 = require("../../common/constants/messages");
let PermissionsService = class PermissionsService {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async getAll(body) {
        const permissions = await this.permissionRepository.getAllPaginate(body);
        return { success: true, message: 'Permissions fetched successfully.', data: permissions };
    }
    async save(body) {
        const moduleKey = body.module.trim().toLowerCase().replace(/\s+/g, '_');
        const actionKey = body.action.trim().toLowerCase();
        const key = `${moduleKey}.${actionKey}`;
        const existingPermission = await this.permissionRepository.getByField({
            key,
        });
        if (existingPermission)
            throw new common_1.ConflictException('This permission already exists!');
        const savePermission = await this.permissionRepository.save({ ...body, key });
        if (!savePermission)
            throw new common_1.BadRequestException(savePermission);
        return { success: true, message: 'permission saved successfully.' };
    }
    async get(id) {
        const permission = await this.permissionRepository.getById(id);
        if (!permission)
            throw new common_1.NotFoundException('Permission not found!');
        return { success: true, message: 'permission retrieved successfully.', data: permission };
    }
    async delete(id) {
        const permissionData = await this.permissionRepository.getById(id);
        if (!permissionData)
            throw new common_1.BadRequestException('Permission not found!');
        const delData = await this.permissionRepository.delete(id);
        if (!delData)
            throw new common_1.BadRequestException(delData instanceof Error ? delData : messages_1.Messages.SOMETHING_WENT_WRONG);
        return { success: true, message: 'permission deleted successfully.' };
    }
};
exports.PermissionsService = PermissionsService;
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_dto_1.PermissionListingDto]),
    __metadata("design:returntype", Promise)
], PermissionsService.prototype, "getAll", null);
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [permission_repository_1.PermissionRepository])
], PermissionsService);
