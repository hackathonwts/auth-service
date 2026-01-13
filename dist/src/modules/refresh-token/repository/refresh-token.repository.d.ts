import { Model } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { RefreshTokenDocument } from '../schemas/refresh-token.schema';
export declare class RefreshTokenRepository extends BaseRepository<RefreshTokenDocument> {
    constructor(RefreshTokenModel: Model<RefreshTokenDocument>);
}
