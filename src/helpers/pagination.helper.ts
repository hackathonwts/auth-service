import { PipelineStage } from 'mongoose';

export interface PaginateOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  allowDiskUse?: boolean;
}

export interface PaginatedResult<T> {
  docs: T[];
  meta: {
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}


/**
 * Reusable aggregate pagination helper.
 * Accepts any aggregation pipeline and automatically appends pagination stages.
 */
export async function aggregatePaginate<T>(model: any, pipeline: PipelineStage[], options: PaginateOptions = {}): Promise<PaginatedResult<T>> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, options.limit || 10);
  const skip = (page - 1) * limit;

  const sortStage: PipelineStage.Sort = { $sort: options.sort || { _id: -1 } };

  // Append sort, skip, limit in one go
  const aggregationPipeline: PipelineStage[] = [...pipeline, sortStage, { $skip: skip }, { $limit: limit }];

  const countPipeline: PipelineStage[] = [...pipeline, { $count: 'totalDocs' }];

  const [docs, countResult] = await Promise.all([model.aggregate(aggregationPipeline).allowDiskUse(options.allowDiskUse ?? true), model.aggregate(countPipeline).allowDiskUse(options.allowDiskUse ?? true)]);

  const totalDocs = countResult.length ? countResult[0].totalDocs : 0;
  const totalPages = Math.ceil(totalDocs / limit);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    docs,
    meta: {
      totalDocs,
      totalPages,
      page,
      limit,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    },
  };
}
