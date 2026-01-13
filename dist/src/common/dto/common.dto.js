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
exports.SortDto = exports.MaxMinDto = exports.DateRangeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DateRangeDto {
}
exports.DateRangeDto = DateRangeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)({ required: false, description: 'Start date', default: 'YYYY-MM-DD' }),
    __metadata("design:type", String)
], DateRangeDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)({ required: false, description: 'End date', default: 'YYYY-MM-DD' }),
    __metadata("design:type", String)
], DateRangeDto.prototype, "end_date", void 0);
class MaxMinDto {
}
exports.MaxMinDto = MaxMinDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ required: false, type: 'number', description: 'Max' }),
    __metadata("design:type", Number)
], MaxMinDto.prototype, "max", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ required: false, type: 'number', description: 'Min' }),
    __metadata("design:type", Number)
], MaxMinDto.prototype, "min", void 0);
class SortDto {
}
exports.SortDto = SortDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ required: false, type: 'string', enum: ['createdAt', 'updatedAt'], default: 'createdAt' }),
    __metadata("design:type", String)
], SortDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ required: false, type: 'string', enum: ["asc", "desc"] }),
    __metadata("design:type", String)
], SortDto.prototype, "order", void 0);
