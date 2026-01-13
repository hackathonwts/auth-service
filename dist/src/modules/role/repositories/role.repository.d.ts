import { RoleDocument } from '../schemas/role.schema';
import { PaginationResponse } from '@common/types/api-response.type';
import { Model } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { RoleListingDto } from '../dto/role.dto';
export declare class RoleRepository extends BaseRepository<RoleDocument> {
    private readonly RoleModel;
    constructor(RoleModel: Model<RoleDocument>);
    getAllPaginate(paginatedDto: RoleListingDto): Promise<PaginationResponse<RoleDocument>>;
    getRole(id: string): Promise<RoleDocument | null>;
}
