import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from '../schemas/permission.schema';

import { PaginationResponse } from '@common/types/api-response.type';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Model, PipelineStage } from 'mongoose';

import { BaseRepository } from '@common/bases/base.repository';
import { PermissionListingDto } from '../dto/permission.dto';

@Injectable()
export class PermissionRepository extends BaseRepository<PermissionDocument> {
  constructor(@InjectModel(Permission.name) private readonly PermissionModel: Model<PermissionDocument>) {
    super(PermissionModel);
  }

  async getAllPaginate(paginatedDto: PermissionListingDto): Promise<PaginationResponse<PermissionDocument>> {
    const conditions = {};
    const and_clauses = [];

    const page = paginatedDto.page || 1;
    const limit = paginatedDto.limit || 10;
    const skip = (page - 1) * limit;

    // Optional search condition
    if (paginatedDto.search) {
      const searchRegex = new RegExp(paginatedDto.search, 'i'); // Case-insensitive search
      and_clauses.push({
        $or: [{ key: searchRegex }, { action: searchRegex }, { module: searchRegex }],
      });
    }

    // Optional sorting
    const sortField = paginatedDto.sortField || '_id'; // Default to sorting by _id if no field is provided
    const sortOrder = paginatedDto.sortOrder === 'asc' ? 1 : -1; // Default to descending order if not provided

    // conditions['$and'] = and_clauses;

    const filterPipeline: PipelineStage[] = [
      { $match: and_clauses.length ? { $and: and_clauses } : {} },
      { $skip: skip },
      { $limit: +limit },
      {
        $project: {
          _id: 1,
          key: 1,
          action: 1,
          module: 1,
          isActive: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } }, // Dynamic sorting
    ];

    const countPipeline: PipelineStage[] = [{ $match: conditions }, { $count: 'total' }];

    // Perform the aggregation
    const [countResult, aggregate] = await Promise.all([
      this.PermissionModel.aggregate(countPipeline, { allowDiskUse: true })
        .exec()
        .catch((error) => {
          throw new InternalServerErrorException(`Error during count aggregation: ${error.message}`);
        }),
      this.PermissionModel.aggregate(filterPipeline, { allowDiskUse: true })
        .exec()
        .catch((error) => {
          throw new InternalServerErrorException(`Error during data aggregation: ${error.message}`);
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
}
