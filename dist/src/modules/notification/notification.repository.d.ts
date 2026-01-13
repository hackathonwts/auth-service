import { Model } from 'mongoose';
import { BaseRepository } from '@common/bases/base.repository';
import { PaginatedResult } from '@helpers/pagination.helper';
import { NotificationDocument } from './notification.schema';
export declare class NotificationRepository extends BaseRepository<NotificationDocument> {
    private readonly notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    getAllPaginate(paginatedDto: any): Promise<PaginatedResult<NotificationDocument>>;
}
