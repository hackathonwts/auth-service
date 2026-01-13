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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const role_repository_1 = require("./repositories/role.repository");
const role_dto_1 = require("./dto/role.dto");
const messages_1 = require("../../common/constants/messages");
let RoleService = class RoleService {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async getAll(body) {
        const roles = await this.roleRepository.getAllPaginate(body);
        return { success: true, message: 'Roles fetched successfully.', data: roles };
    }
    async save(body) {
        const existingRole = await this.roleRepository.getByField({ role: body.role, isDeleted: false });
        if (existingRole)
            throw new common_1.ConflictException('This role already exists!');
        const saveRole = await this.roleRepository.save(body);
        if (!saveRole)
            throw new common_1.BadRequestException(saveRole);
        return { success: true, message: 'role saved successfully.' };
    }
    async get(id) {
        const role = await this.roleRepository.getRole(id);
        if (!role)
            throw new common_1.NotFoundException('Role not found!');
        return { success: true, message: 'role retrieved successfully.', data: role };
    }
    async update(id, body) {
        const roleData = await this.roleRepository.getByField({ isDeleted: false, _id: new mongoose_1.Types.ObjectId(id) });
        if (!roleData)
            throw new common_1.BadRequestException('Role not found!');
        if (roleData?._id && roleData.role == 'admin')
            throw new common_1.BadRequestException('Modifying admin role is restricted!');
        if (body.role) {
            const existingRole = await this.roleRepository.getByField({ role: body.role, isDeleted: false, _id: { $ne: new mongoose_1.Types.ObjectId(id) } });
            if (existingRole)
                throw new common_1.ConflictException('This role already exists!');
        }
        const updatedValue = {
            role: body.role ?? roleData.role,
            roleGroup: body.roleGroup ?? roleData.roleGroup,
            roleDisplayName: body.roleDisplayName ?? roleData.roleDisplayName,
        };
        const update = await this.roleRepository.updateById(updatedValue, new mongoose_1.Types.ObjectId(id));
        if (!update)
            throw new common_1.BadRequestException(update instanceof Error ? update : messages_1.Messages.SOMETHING_WENT_WRONG);
        return { success: true, message: 'role updated successfully.', data: update };
    }
    async delete(id) {
        const roleData = await this.roleRepository.getByField({ isDeleted: false, _id: new mongoose_1.Types.ObjectId(id) });
        if (!roleData)
            throw new common_1.BadRequestException('Role not found!');
        if (roleData?._id && roleData.role == 'admin')
            throw new common_1.BadRequestException('Modifying admin role is restricted!');
        const delData = await this.roleRepository.updateById({ isDeleted: true }, id);
        if (!delData)
            throw new common_1.BadRequestException(delData instanceof Error ? delData : messages_1.Messages.SOMETHING_WENT_WRONG);
        return { success: true, message: 'role deleted successfully.' };
    }
    async statusUpdate(id, body) {
        const roleData = await this.roleRepository.getByField({ isDeleted: false, _id: new mongoose_1.Types.ObjectId(id) });
        if (!roleData)
            throw new common_1.BadRequestException('Role not found!');
        if (roleData?._id && roleData.role == 'admin')
            throw new common_1.BadRequestException('Modifying admin role is restricted!');
        const update = await this.roleRepository.updateById({ status: body.status }, new mongoose_1.Types.ObjectId(id));
        if (!update)
            throw new common_1.BadRequestException(update instanceof Error ? update : messages_1.Messages.SOMETHING_WENT_WRONG);
        return { success: true, message: 'Status updated successfully.', data: update };
    }
};
exports.RoleService = RoleService;
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.RoleListingDto]),
    __metadata("design:returntype", Promise)
], RoleService.prototype, "getAll", null);
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_repository_1.RoleRepository])
], RoleService);
