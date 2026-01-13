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
exports.SavePermissionDto = exports.PermissionListingDto = exports.PermissionAction = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const sort_order_enum_1 = require("../../../common/enum/sort-order.enum");
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["CREATE"] = "Create";
    PermissionAction["READ"] = "Read";
    PermissionAction["UPDATE"] = "Update";
    PermissionAction["DELETE"] = "Delete";
    PermissionAction["APPROVE"] = "Approve";
    PermissionAction["REJECT"] = "Reject";
    PermissionAction["EXPORT"] = "Export";
    PermissionAction["IMPORT"] = "Import";
    PermissionAction["ASSIGN"] = "Assign";
    PermissionAction["MANAGE"] = "Manage";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
class PermissionListingDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.PermissionListingDto = PermissionListingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 1)),
    __metadata("design:type", Number)
], PermissionListingDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 10)),
    __metadata("design:type", Number)
], PermissionListingDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search...' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Search is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PermissionListingDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort Field' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Sort Field is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PermissionListingDto.prototype, "sortField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort Order',
        enum: sort_order_enum_1.SortOrderEnum,
    }),
    (0, class_validator_1.IsEnum)(sort_order_enum_1.SortOrderEnum, { message: 'Sort order must be either asc or desc' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PermissionListingDto.prototype, "sortOrder", void 0);
class SavePermissionDto {
}
exports.SavePermissionDto = SavePermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Orders' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SavePermissionDto.prototype, "module", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PermissionAction, example: PermissionAction.CREATE }),
    (0, class_validator_1.IsEnum)(PermissionAction),
    __metadata("design:type", String)
], SavePermissionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SavePermissionDto.prototype, "description", void 0);
