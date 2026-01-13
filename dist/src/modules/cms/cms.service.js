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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const cms_repository_1 = require("./repositories/cms.repository");
const messages_1 = require("../../common/constants/messages");
let CmsService = class CmsService {
    constructor(cmsRepository) {
        this.cmsRepository = cmsRepository;
    }
    async getAll(body) {
        const getAllCmss = await this.cmsRepository.getAllPaginate(body);
        return { success: true, message: 'CMS data fetched successfully.', data: getAllCmss };
    }
    async get(id) {
        const cms = await this.cmsRepository.getByField({ _id: new mongoose_1.Types.ObjectId(id), isDeleted: false });
        if (!cms)
            throw new common_1.BadRequestException('CMS not found!');
        return { success: true, message: 'CMS retrieved successfully.', data: cms };
    }
    async update(id, body) {
        const cms = await this.cmsRepository.getByField({ _id: new mongoose_1.Types.ObjectId(id), isDeleted: false });
        if (!cms)
            throw new common_1.BadRequestException('CMS not found!');
        const updatedValue = {
            content: body.content
        };
        const update = await this.cmsRepository.updateById(updatedValue, new mongoose_1.Types.ObjectId(id));
        if (!update)
            throw new common_1.BadRequestException(update instanceof Error ? update : messages_1.Messages.SOMETHING_WENT_WRONG);
        return { success: true, message: 'CMS updated successfully.', data: update };
    }
    async statusUpdate(id, body) {
        const cms = await this.cmsRepository.getByField({ _id: new mongoose_1.Types.ObjectId(id), isDeleted: false });
        if (!cms)
            throw new common_1.BadRequestException('CMS not found!');
        const update = await this.cmsRepository.updateById(body, new mongoose_1.Types.ObjectId(id));
        if (!update)
            throw new common_1.BadRequestException(update instanceof Error ? update : messages_1.Messages.SOMETHING_WENT_WRONG);
        return { success: true, message: 'Status updated successfully.', data: update };
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cms_repository_1.CmsRepository])
], CmsService);
