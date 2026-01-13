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
exports.CmsRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const cms_schema_1 = require("../schemas/cms.schema");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("mongoose");
const base_repository_1 = require("../../../common/bases/base.repository");
let CmsRepository = class CmsRepository extends base_repository_1.BaseRepository {
    constructor(CmsModel) {
        super(CmsModel);
        this.CmsModel = CmsModel;
    }
    async getAllPaginate(paginatedDto) {
        const conditions = {};
        const and_clauses = [];
        const page = paginatedDto.page || 1;
        const limit = paginatedDto.limit || 10;
        const skip = (page - 1) * limit;
        and_clauses.push({ isDeleted: false });
        if (paginatedDto.search) {
            const searchRegex = new RegExp(paginatedDto.search, 'i');
            and_clauses.push({
                $or: [
                    { title: searchRegex }
                ]
            });
        }
        if (paginatedDto.status) {
            and_clauses.push({ status: paginatedDto.status });
        }
        const sortField = paginatedDto.sortField || '_id';
        const sortOrder = paginatedDto.sortOrder === 'asc' ? 1 : -1;
        conditions['$and'] = and_clauses;
        const filterPipeline = [
            { $match: conditions },
            { $skip: skip },
            { $limit: +limit },
            {
                $project: {
                    title: 1,
                    slug: 1,
                    createdAt: 1,
                    status: 1
                }
            },
            { $sort: { [sortField]: sortOrder } },
        ];
        const countPipeline = [
            { $match: conditions },
            { $count: 'total' }
        ];
        const [countResult, aggregate] = await Promise.all([
            this.CmsModel.aggregate(countPipeline, { allowDiskUse: true }).exec()
                .catch((error) => {
                throw new common_1.InternalServerErrorException(`Error during count aggregation: ${error.message}`);
            }),
            this.CmsModel.aggregate(filterPipeline, { allowDiskUse: true }).exec()
                .catch((error) => {
                throw new common_1.InternalServerErrorException(`Error during data aggregation: ${error.message}`);
            })
        ]);
        const totalDocs = countResult.length ? countResult[0].total : 0;
        const hasNextPage = totalDocs > 0 && (totalDocs - (skip + aggregate.length) > 0);
        const hasPrevPage = page != 1;
        const totalPages = Math.ceil(totalDocs / limit);
        return {
            meta: {
                totalDocs: countResult.length ? countResult[0].total : 0,
                skip: skip,
                page: page,
                totalPages: totalPages,
                limit: limit,
                hasPrevPage,
                hasNextPage,
                prevPage: hasPrevPage ? (page - 1) : null,
                nextPage: hasNextPage ? (page + 1) : null,
            },
            docs: aggregate,
        };
    }
};
exports.CmsRepository = CmsRepository;
exports.CmsRepository = CmsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cms_schema_1.Cms.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CmsRepository);
