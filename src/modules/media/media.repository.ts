import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, PipelineStage } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { Media, MediaDocument } from './media.schema';
import { aggregatePaginate, PaginatedResult } from '@helpers/pagination.helper';

@Injectable()
export class MediaRepository extends BaseRepository<MediaDocument> {
  constructor(@InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>) {
    super(mediaModel);
  }

  async getAllPaginate(paginatedDto: any): Promise<PaginatedResult<MediaDocument>> {
    const { page = 1, limit = 10, search, status, sortField = '_id', sortOrder = 'desc' } = paginatedDto;

    const andClauses: Record<string, any>[] = [];

    // Optional search condition
    if (search) {
      const searchRegex = new RegExp(paginatedDto.search, 'i'); // Case-insensitive search
      andClauses.push({
        $or: [{ question: searchRegex }, { answer: searchRegex }],
      });
    }

    // Status filter
    if (status) {
      andClauses.push({ status });
    }

    const filterPipeline: PipelineStage[] = [
      { $match: { $and: andClauses } },
      {
        $project: {
          isDeleted: 0,
        },
      },
    ];

    // Apply pagination
    return await aggregatePaginate<MediaDocument>(this.mediaModel, filterPipeline, {
      page,
      limit,
      sort: {
        [sortField]: sortOrder === 'asc' ? 1 : -1,
      },
    });
  }
}
