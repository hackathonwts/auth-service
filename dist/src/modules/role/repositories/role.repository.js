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
exports.RoleRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const role_schema_1 = require("../schemas/role.schema");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("mongoose");
const base_repository_1 = require("../../../common/bases/base.repository");
let RoleRepository = class RoleRepository extends base_repository_1.BaseRepository {
    constructor(RoleModel) {
        super(RoleModel);
        this.RoleModel = RoleModel;
    }
    async getAllPaginate(paginatedDto) {
        const conditions = {};
        const and_clauses = [];
        const page = paginatedDto.page || 1;
        const limit = paginatedDto.limit || 10;
        const skip = (page - 1) * limit;
        and_clauses.push({ isDeleted: false, role: { $ne: 'admin' } });
        if (paginatedDto.search) {
            const searchRegex = new RegExp(paginatedDto.search, 'i');
            and_clauses.push({
                $or: [{ role: searchRegex }, { roleGroup: searchRegex }],
            });
        }
        if (paginatedDto.status) {
            and_clauses.push({ status: paginatedDto.status });
        }
        if (paginatedDto.roleGroup) {
            and_clauses.push({ roleGroup: paginatedDto.roleGroup });
        }
        const sortField = paginatedDto.sortField || '_id';
        const sortOrder = paginatedDto.sortOrder === 'asc' ? 1 : -1;
        conditions['$and'] = and_clauses;
        const filterPipeline = [
            { $match: conditions },
            {
                $lookup: {
                    from: 'permissions',
                    localField: 'permissions',
                    foreignField: '_id',
                    as: 'permissionData',
                    pipeline: [{ $project: { key: 1 } }],
                },
            },
            {
                $addFields: {
                    permissionKeys: {
                        $map: {
                            input: '$permissionData',
                            as: 'p',
                            in: '$$p.key',
                        },
                    },
                    permissionCount: { $size: '$permissionData' },
                },
            },
            { $skip: skip },
            { $limit: +limit },
            {
                $project: {
                    role: 1,
                    roleGroup: 1,
                    roleDisplayName: 1,
                    status: 1,
                    permissions: 1,
                    permissionCount: 1
                },
            },
            { $sort: { [sortField]: sortOrder } },
        ];
        const countPipeline = [{ $match: conditions }, { $count: 'total' }];
        const [countResult, aggregate] = await Promise.all([
            this.RoleModel.aggregate(countPipeline, { allowDiskUse: true })
                .exec()
                .catch((error) => {
                throw new common_1.InternalServerErrorException(`Error during count aggregation: ${error.message}`);
            }),
            this.RoleModel.aggregate(filterPipeline, { allowDiskUse: true })
                .exec()
                .catch((error) => {
                throw new common_1.InternalServerErrorException(`Error during data aggregation: ${error.message}`);
            }),
        ]);
        const totalDocs = countResult.length ? countResult[0].total : 0;
        const hasNextPage = totalDocs > 0 && totalDocs - (skip + aggregate.length) > 0;
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
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
            },
            docs: aggregate,
        };
    }
    async getRole(id) {
        const filterPipeline = [
            {
                $match: {
                    _id: new mongoose_2.Types.ObjectId(id),
                    isDeleted: false,
                    role: { $ne: 'admin' },
                },
            },
            {
                $lookup: {
                    from: 'permissions',
                    localField: 'permissions',
                    foreignField: '_id',
                    as: 'permissionData',
                    pipeline: [
                        {
                            $project: {
                                module: 1,
                                action: 1,
                                description: 1,
                                key: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    permissionKeys: {
                        $map: {
                            input: '$permissionData',
                            as: 'perm',
                            in: '$$perm.key',
                        },
                    },
                },
            },
            {
                $project: {
                    role: 1,
                    roleGroup: 1,
                    roleDisplayName: 1,
                    status: 1,
                    permissions: 1,
                    permissionData: 1,
                    permissionKeys: 1,
                },
            },
        ];
        const aggregate = await this.RoleModel.aggregate(filterPipeline, { allowDiskUse: true })
            .exec()
            .catch((error) => {
            throw new common_1.InternalServerErrorException(`Error during data aggregation: ${error.message}`);
        });
        return aggregate[0] ?? null;
    }
};
exports.RoleRepository = RoleRepository;
exports.RoleRepository = RoleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RoleRepository);
