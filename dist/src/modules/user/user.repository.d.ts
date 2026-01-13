import { FilterQuery, Model } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { UserDocument } from './user.schema';
import { ListingUserDto } from './user.dto';
import { PaginatedResult } from '@helpers/pagination.helper';
export declare class UserRepository extends BaseRepository<UserDocument> {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    getUserDetails(userId: string, params?: FilterQuery<UserDocument>): Promise<UserDocument | null>;
    getAllPaginate(paginatedDto: ListingUserDto): Promise<PaginatedResult<UserDocument>>;
}
