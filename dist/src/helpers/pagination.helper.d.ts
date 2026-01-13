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
export declare function aggregatePaginate<T>(model: any, pipeline: PipelineStage[], options?: PaginateOptions): Promise<PaginatedResult<T>>;
