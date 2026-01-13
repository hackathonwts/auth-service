import { UserDeviceDocument } from '../schemas/user-device.schema';
import { Model } from 'mongoose';
import { UserDeviceListingDto } from '../dto/user-devices.dto';
import { BaseRepository } from '@common/bases/base.repository';
import { PaginationResponse } from '@common/types/api-response.type';
export declare class UserDeviceRepository extends BaseRepository<UserDeviceDocument> {
    private readonly userDeviceModel;
    constructor(userDeviceModel: Model<UserDeviceDocument>);
    getAllDevicesPaginated(paginatedDto: UserDeviceListingDto, token?: string): Promise<PaginationResponse<UserDeviceDocument>>;
}
