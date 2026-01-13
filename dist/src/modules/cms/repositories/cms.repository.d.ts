import { CmsDocument } from '../schemas/cms.schema';
import { PaginationResponse } from '@common/types/api-response.type';
import { Model } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { CmsListingDto } from '../dto/cms.dto';
export declare class CmsRepository extends BaseRepository<CmsDocument> {
    private readonly CmsModel;
    constructor(CmsModel: Model<CmsDocument>);
    getAllPaginate(paginatedDto: CmsListingDto): Promise<PaginationResponse<CmsDocument>>;
}
