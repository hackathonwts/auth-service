import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, PipelineStage } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { aggregatePaginate, PaginatedResult } from '@helpers/pagination.helper';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationRepository extends BaseRepository<NotificationDocument> {
  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>) {
    super(notificationModel);
  }

  async getAllPaginate(paginatedDto: any): Promise<PaginatedResult<NotificationDocument>> {
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
    return await aggregatePaginate<NotificationDocument>(this.notificationModel, filterPipeline, {
      page,
      limit,
      sort: {
        [sortField]: sortOrder === 'asc' ? 1 : -1,
      },
    });
  }
}
