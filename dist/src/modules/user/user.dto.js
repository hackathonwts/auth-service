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
exports.UpdateUserPasswordDto = exports.UpdateUserStatusDto = exports.ListingUserDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const status_enum_1 = require("../../common/enum/status.enum");
const sort_order_enum_1 = require("../../common/enum/sort-order.enum");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
const user_role_enum_1 = require("../../common/enum/user-role.enum");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full Name', required: true }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full Name is required!' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', required: true }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value))),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required!' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Password must be at least 8 characters long and contain at least one letter and one number.' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long!' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, { message: 'Password must contain at least one letter and one number!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User Role', required: true, type: 'string' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsEnum)([user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER], { message: 'Role must be either admin or user' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Profile image (jpg, png, jpeg)', type: 'string', format: 'binary' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "profileImage", void 0);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email address' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value))),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Full Name' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full Name is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User Name' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'User Name is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User Role', type: 'string' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : value instanceof mongoose_1.Types.ObjectId ? value.toString() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'User Role is required!' }),
    (0, class_validator_1.IsMongoId)({ message: 'User Role is not a valid MongoDB ObjectId.!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profile image (jpg, png, jpeg)',
        type: 'string',
        format: 'binary',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "profileImage", void 0);
class ListingUserDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.role = user_role_enum_1.UserRole.USER;
        this.roleGroup = user_role_enum_1.RoleGroup.FRONTEND;
    }
}
exports.ListingUserDto = ListingUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 1)),
    __metadata("design:type", Number)
], ListingUserDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 10)),
    __metadata("design:type", Number)
], ListingUserDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListingUserDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status Filter', enum: status_enum_1.StatusEnum }),
    (0, class_validator_1.IsEnum)(status_enum_1.StatusEnum, { message: 'Status must be either Active or Inactive' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListingUserDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort Field' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListingUserDto.prototype, "sortField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort Order',
        enum: sort_order_enum_1.SortOrderEnum,
    }),
    (0, class_validator_1.IsEnum)(sort_order_enum_1.SortOrderEnum, { message: 'Sort order must be either asc or desc' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListingUserDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User Role ID Filter' }),
    (0, class_validator_1.IsMongoId)({ message: 'Role ID is not a valid MongoDB ObjectId.!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListingUserDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User Role', type: 'string' }),
    (0, class_validator_1.IsEnum)([user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER], { message: 'Role must be either admin or user' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListingUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Role Group Filter', enum: user_role_enum_1.RoleGroup }),
    (0, class_validator_1.IsEnum)(user_role_enum_1.RoleGroup, { message: 'Role Group must be either backend or frontend' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListingUserDto.prototype, "roleGroup", void 0);
class UpdateUserStatusDto {
}
exports.UpdateUserStatusDto = UpdateUserStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status', required: true, enum: status_enum_1.StatusEnum }),
    (0, class_validator_1.IsEnum)(status_enum_1.StatusEnum, { message: 'Status must be either Active or Inactive' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Status is required' }),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "status", void 0);
class UpdateUserPasswordDto {
}
exports.UpdateUserPasswordDto = UpdateUserPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New password must be at least 8 characters long and contain at least one letter and one number.', required: true }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long!' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
        message: 'Password must contain at least one letter and one number!',
    }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required!' }),
    __metadata("design:type", String)
], UpdateUserPasswordDto.prototype, "password", void 0);
