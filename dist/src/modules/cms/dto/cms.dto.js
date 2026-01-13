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
exports.StatusCmsDto = exports.CmsListingDto = exports.UpdateCmsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const status_enum_1 = require("../../../common/enum/status.enum");
const sort_order_enum_1 = require("../../../common/enum/sort-order.enum");
class UpdateCmsDto {
}
exports.UpdateCmsDto = UpdateCmsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value?.trim() : String(value)),
    (0, class_validator_1.IsNotEmpty)({ message: 'Content is required' }),
    __metadata("design:type", String)
], UpdateCmsDto.prototype, "content", void 0);
class CmsListingDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.CmsListingDto = CmsListingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 1)),
    __metadata("design:type", Number)
], CmsListingDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 10)),
    __metadata("design:type", Number)
], CmsListingDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Search..." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CmsListingDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Status Filter", enum: status_enum_1.StatusEnum }),
    (0, class_validator_1.IsEnum)(status_enum_1.StatusEnum, { message: 'Status must be either Active or Inactive' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CmsListingDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Sort Field" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CmsListingDto.prototype, "sortField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Sort Order",
        enum: sort_order_enum_1.SortOrderEnum,
    }),
    (0, class_validator_1.IsEnum)(sort_order_enum_1.SortOrderEnum, { message: 'Sort order must be either asc or desc' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CmsListingDto.prototype, "sortOrder", void 0);
class StatusCmsDto {
}
exports.StatusCmsDto = StatusCmsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Status", required: true, enum: status_enum_1.StatusEnum }),
    (0, class_validator_1.IsEnum)(status_enum_1.StatusEnum, { message: 'Status must be either Active or Inactive' }),
    (0, class_validator_1.IsNotEmpty)({ message: "Status is required" }),
    __metadata("design:type", String)
], StatusCmsDto.prototype, "status", void 0);
