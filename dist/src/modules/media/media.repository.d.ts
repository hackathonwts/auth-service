import { Model } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { MediaDocument } from './media.schema';
import { PaginatedResult } from '@helpers/pagination.helper';
export declare class MediaRepository extends BaseRepository<MediaDocument> {
    private readonly mediaModel;
    constructor(mediaModel: Model<MediaDocument>);
    getAllPaginate(paginatedDto: any): Promise<PaginatedResult<MediaDocument>>;
}
