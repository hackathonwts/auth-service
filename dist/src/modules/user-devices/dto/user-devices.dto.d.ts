import { Types } from "mongoose";
export declare class UserDeviceListingDto {
    page?: number;
    limit?: number;
    user_id: string | Types.ObjectId;
}
