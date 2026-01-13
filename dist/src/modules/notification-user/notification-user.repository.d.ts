import { Model } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { PaginatedResult } from '@helpers/pagination.helper';
import { NotificationUserDocument } from './notification-user.schema';
export declare class NotificationUserRepository extends BaseRepository<NotificationUserDocument> {
    private readonly notificationModel;
    constructor(notificationModel: Model<NotificationUserDocument>);
    getAllPaginate(paginatedDto: any): Promise<PaginatedResult<NotificationUserDocument>>;
}
