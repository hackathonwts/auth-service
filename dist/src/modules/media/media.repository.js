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
exports.MediaRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("mongoose");
const base_repository_1 = require("../../common/bases/base.repository");
const media_schema_1 = require("./media.schema");
const pagination_helper_1 = require("../../helpers/pagination.helper");
let MediaRepository = class MediaRepository extends base_repository_1.BaseRepository {
    constructor(mediaModel) {
        super(mediaModel);
        this.mediaModel = mediaModel;
    }
    async getAllPaginate(paginatedDto) {
        const { page = 1, limit = 10, search, status, sortField = '_id', sortOrder = 'desc' } = paginatedDto;
        const andClauses = [];
        if (search) {
            const searchRegex = new RegExp(paginatedDto.search, 'i');
            andClauses.push({
                $or: [{ question: searchRegex }, { answer: searchRegex }],
            });
        }
        if (status) {
            andClauses.push({ status });
        }
        const filterPipeline = [
            { $match: { $and: andClauses } },
            {
                $project: {
                    isDeleted: 0,
                },
            },
        ];
        return await (0, pagination_helper_1.aggregatePaginate)(this.mediaModel, filterPipeline, {
            page,
            limit,
            sort: {
                [sortField]: sortOrder === 'asc' ? 1 : -1,
            },
        });
    }
};
exports.MediaRepository = MediaRepository;
exports.MediaRepository = MediaRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(media_schema_1.Media.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MediaRepository);
