import { PermissionDocument } from '../schemas/permission.schema';
import { PaginationResponse } from '@common/types/api-response.type';
import { Model } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { PermissionListingDto } from '../dto/permission.dto';
export declare class PermissionRepository extends BaseRepository<PermissionDocument> {
    private readonly PermissionModel;
    constructor(PermissionModel: Model<PermissionDocument>);
    getAllPaginate(paginatedDto: PermissionListingDto): Promise<PaginationResponse<PermissionDocument>>;
}
