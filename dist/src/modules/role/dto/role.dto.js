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
exports.StatusRoleDto = exports.UpdateRoleDto = exports.SaveRoleDto = exports.RoleListingDto = exports.RoleGroupEnum = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const status_enum_1 = require("../../../common/enum/status.enum");
const sort_order_enum_1 = require("../../../common/enum/sort-order.enum");
var RoleGroupEnum;
(function (RoleGroupEnum) {
    RoleGroupEnum["BACKEND"] = "backend";
    RoleGroupEnum["FRONTEND"] = "frontend";
})(RoleGroupEnum || (exports.RoleGroupEnum = RoleGroupEnum = {}));
class RoleListingDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.RoleListingDto = RoleListingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Role Group', enum: RoleGroupEnum }),
    (0, class_validator_1.IsEnum)(RoleGroupEnum, { message: 'Role Group must be either backend or frontend' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role Group is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RoleListingDto.prototype, "roleGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 1)),
    __metadata("design:type", Number)
], RoleListingDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 10)),
    __metadata("design:type", Number)
], RoleListingDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search...' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Search is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RoleListingDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status Filter', enum: status_enum_1.StatusEnum }),
    (0, class_validator_1.IsEnum)(status_enum_1.StatusEnum, { message: 'Status must be either Active or Inactive' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RoleListingDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort Field' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Sort Field is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RoleListingDto.prototype, "sortField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort Order',
        enum: sort_order_enum_1.SortOrderEnum,
    }),
    (0, class_validator_1.IsEnum)(sort_order_enum_1.SortOrderEnum, { message: 'Sort order must be either asc or desc' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RoleListingDto.prototype, "sortOrder", void 0);
class SaveRoleDto {
}
exports.SaveRoleDto = SaveRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role', required: true }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role is required' }),
    (0, class_validator_1.Matches)(/^(?![0-9]+$).*/, { message: 'The field cannot be a number' }),
    __metadata("design:type", String)
], SaveRoleDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role Group', required: true, enum: RoleGroupEnum }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role Group is required' }),
    (0, class_validator_1.IsEnum)(RoleGroupEnum, { message: 'Role Group must be either backend or frontend' }),
    __metadata("design:type", String)
], SaveRoleDto.prototype, "roleGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role Display Name', required: true }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role Display Name is required' }),
    __metadata("design:type", String)
], SaveRoleDto.prototype, "roleDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission IDs',
        type: [String],
        example: ['64cfa8a7e4b0a9c12d8f1e11'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Permissions are required' }),
    (0, class_validator_1.IsMongoId)({ each: true, message: 'Each permission must be a valid ObjectId' }),
    __metadata("design:type", Array)
], SaveRoleDto.prototype, "permissions", void 0);
class UpdateRoleDto {
}
exports.UpdateRoleDto = UpdateRoleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Role' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role is required' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Role Group', enum: RoleGroupEnum }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role Group is required' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "roleGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Role Display Name' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role Display Name is required' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "roleDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Permission IDs',
        type: [String],
        example: ['64cfa8a7e4b0a9c12d8f1e11'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Permissions must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Permissions cannot be empty' }),
    (0, class_validator_1.IsMongoId)({ each: true, message: 'Each permission must be a valid ObjectId' }),
    __metadata("design:type", Array)
], UpdateRoleDto.prototype, "permissions", void 0);
class StatusRoleDto {
}
exports.StatusRoleDto = StatusRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status', required: true, enum: status_enum_1.StatusEnum }),
    (0, class_validator_1.IsEnum)(status_enum_1.StatusEnum, { message: 'Status must be either Active or Inactive' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Status is required' }),
    __metadata("design:type", String)
], StatusRoleDto.prototype, "status", void 0);
