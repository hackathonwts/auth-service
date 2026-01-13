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
exports.CmsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cms_service_1 = require("./cms.service");
const passport_1 = require("@nestjs/passport");
const cms_dto_1 = require("./dto/cms.dto");
const mongoid_pipe_1 = require("../../common/pipes/mongoid.pipe");
let CmsController = class CmsController {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async getAllCms(dto) {
        return this.cmsService.getAll(dto);
    }
    async getCms(id) {
        return this.cmsService.get(id);
    }
    async updateCms(id, dto) {
        return this.cmsService.update(id, dto);
    }
    async statusChange(id, dto) {
        return this.cmsService.statusUpdate(id, dto);
    }
};
exports.CmsController = CmsController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('getall'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CmsListingDto]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getAllCms", null);
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
], CmsController.prototype, "getCms", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', new mongoid_pipe_1.MongoIdPipe())),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cms_dto_1.UpdateCmsDto]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "updateCms", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Patch)('status-change/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id', new mongoid_pipe_1.MongoIdPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cms_dto_1.StatusCmsDto]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "statusChange", null);
exports.CmsController = CmsController = __decorate([
    (0, swagger_1.ApiTags)('CMS'),
    (0, common_1.Controller)('admin/cms'),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], CmsController);
