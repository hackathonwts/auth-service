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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const base_repository_1 = require("../../common/bases/base.repository");
const user_schema_1 = require("./user.schema");
const pagination_helper_1 = require("../../helpers/pagination.helper");
const user_role_enum_1 = require("../../common/enum/user-role.enum");
let UserRepository = class UserRepository extends base_repository_1.BaseRepository {
    constructor(userModel) {
        super(userModel);
        this.userModel = userModel;
    }
    async getUserDetails(userId, params = {}) {
        const matchStage = {
            $match: {
                _id: new mongoose_1.Types.ObjectId(userId),
                isDeleted: false,
                ...params,
            },
        };
        const pipeline = [
            matchStage,
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                role: 1,
                                roleGroup: 1,
                                roleDisplayName: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$role',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    password: 0,
                    isDeleted: 0,
                    updatedAt: 0,
                },
            },
        ];
        const [user] = await this.userModel.aggregate(pipeline).exec();
        return user || null;
    }
    async getAllPaginate(paginatedDto) {
        try {
            const { page = 1, limit = 10, search, status, roleId, role = user_role_enum_1.UserRole.USER, roleGroup = user_role_enum_1.RoleGroup.FRONTEND, sortField = '_id', sortOrder = 'desc' } = paginatedDto;
            const andClauses = [{ isDeleted: false }];
            if (search) {
                const regex = new RegExp(search, 'i');
                andClauses.push({
                    $or: [{ fullName: regex }, { email: regex }, { userName: regex }],
                });
            }
            if (roleId) {
                andClauses.push({ role: new mongoose_1.Types.ObjectId(roleId) });
            }
            if (status) {
                andClauses.push({ status });
            }
            const pipeline = [
                { $match: { $and: andClauses } },
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'role',
                        foreignField: '_id',
                        as: 'role',
                        pipeline: [
                            {
                                $match: {
                                    isDeleted: false,
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    role: 1,
                                    roleDisplayName: 1,
                                    roleGroup: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$role',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        'role.roleGroup': roleGroup,
                        'role.role': role,
                    },
                },
                {
                    $project: {
                        fullName: 1,
                        email: 1,
                        userName: 1,
                        profileImage: 1,
                        createdAt: 1,
                        status: 1,
                        'role._id': 1,
                        'role.role': 1,
                        'role.roleDisplayName': 1,
                        'role.roleGroup': 1,
                    },
                },
            ];
            return await (0, pagination_helper_1.aggregatePaginate)(this.userModel, pipeline, {
                page,
                limit,
                sort: {
                    [sortField]: sortOrder === 'asc' ? 1 : -1,
                },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Pagination failed: ${error.message}`);
        }
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UserRepository);
