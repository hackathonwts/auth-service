import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { User, UserDocument } from './user.schema';
import { ListingUserDto } from './user.dto';
import { aggregatePaginate, PaginatedResult } from '@helpers/pagination.helper';
import { RoleGroup, UserRole } from '@common/enum/user-role.enum';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  /** 🔹 Get single user with populated role details */
  async getUserDetails(userId: string, params: FilterQuery<UserDocument> = {}): Promise<UserDocument | null> {
    const matchStage: PipelineStage.Match = {
      $match: {
        _id: new Types.ObjectId(userId),
        isDeleted: false,
        ...params,
      },
    };

    const pipeline: PipelineStage[] = [
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
          preserveNullAndEmptyArrays: true, // keep users even if role missing
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

  /** 🔹 Paginated list for admin or frontend users (based on roleGroup param) */
  async getAllPaginate(paginatedDto: ListingUserDto): Promise<PaginatedResult<UserDocument>> {
    try {
      const { page = 1, limit = 10, search, status, roleId, role = UserRole.USER, roleGroup = RoleGroup.FRONTEND, sortField = '_id', sortOrder = 'desc' } = paginatedDto;

      const andClauses: Record<string, any>[] = [{ isDeleted: false }];

      // Search filter
      if (search) {
        const regex = new RegExp(search, 'i');
        andClauses.push({
          $or: [{ fullName: regex }, { email: regex }, { userName: regex }],
        });
      }

      // User Role filter
      if (roleId) {
        andClauses.push({ role: new Types.ObjectId(roleId) });
      }

      // Status filter
      if (status) {
        andClauses.push({ status });
      }

      // Build pipeline
      const pipeline: PipelineStage[] = [
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
      // Apply pagination
      return await aggregatePaginate<UserDocument>(this.userModel, pipeline, {
        page,
        limit,
        sort: {
          [sortField]: sortOrder === 'asc' ? 1 : -1,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Pagination failed: ${error.message}`);
    }
  }
}
