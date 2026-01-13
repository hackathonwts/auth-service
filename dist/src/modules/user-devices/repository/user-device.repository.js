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
exports.UserDeviceRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_device_schema_1 = require("../schemas/user-device.schema");
const mongoose_2 = require("mongoose");
const base_repository_1 = require("../../../common/bases/base.repository");
let UserDeviceRepository = class UserDeviceRepository extends base_repository_1.BaseRepository {
    constructor(userDeviceModel) {
        super(userDeviceModel);
        this.userDeviceModel = userDeviceModel;
    }
    async getAllDevicesPaginated(paginatedDto, token) {
        try {
            const conditions = {};
            const and_clauses = [];
            const page = paginatedDto.page || 1;
            const limit = paginatedDto.limit || 10;
            const skip = (page - 1) * (limit);
            and_clauses.push({ isDeleted: false, expired: false, user_id: new mongoose_2.Types.ObjectId(paginatedDto.user_id) });
            conditions['$and'] = and_clauses;
            const filterPipeline = [
                { $match: conditions },
                { $skip: skip },
                { $limit: +limit },
                {
                    $project: {
                        user_id: '$user_id',
                        deviceToken: '$deviceToken',
                        deviceType: '$deviceType',
                        ip: '$ip',
                        ip_lat: '$ip_lat',
                        ip_long: '$ip_long',
                        browserInfo: '$browserInfo',
                        deviceInfo: '$deviceInfo',
                        operatingSystem: '$operatingSystem',
                        last_active: '$last_active',
                        state: '$state',
                        country: '$country',
                        city: '$city',
                        timezone: '$timezone',
                        accessToken: '$accessToken',
                        expired: '$expired',
                        role: '$role',
                        isDeleted: '$isDeleted',
                        isCurrent: { $eq: ['$accessToken', token] }
                    }
                },
                { $sort: { _id: -1 } },
            ];
            const countPipeline = [
                { $match: conditions },
                { $count: 'total' }
            ];
            const [countResult, aggregate] = await Promise.all([
                this.userDeviceModel.aggregate(countPipeline, { allowDiskUse: true }).exec(),
                this.userDeviceModel.aggregate(filterPipeline, { allowDiskUse: true }).exec()
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
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.UserDeviceRepository = UserDeviceRepository;
exports.UserDeviceRepository = UserDeviceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_device_schema_1.UserDevice.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserDeviceRepository);
