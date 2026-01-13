import { HydratedDocument, Schema as MongoSchema, Types } from "mongoose";
export declare class UserDevice {
    user_id: string | Types.ObjectId;
    deviceToken: string;
    deviceType: string;
    ip: string;
    ip_lat: string;
    ip_long: string;
    browserInfo: {
        name: string;
        version: string;
    };
    deviceInfo: {
        vendor: string;
        model: string;
        type: string;
    };
    operatingSystem: {
        name: string;
        version: string;
    };
    last_active: any;
    state: string;
    country: string;
    city: string;
    timezone: string;
    accessToken: string;
    expired: boolean;
    role: string;
    isLoggedOut: boolean;
    isDeleted: boolean;
}
export type UserDeviceDocument = HydratedDocument<UserDevice>;
export declare const UserDeviceSchema: MongoSchema<UserDevice, import("mongoose").Model<UserDevice, any, any, any, import("mongoose").Document<unknown, any, UserDevice, any, {}> & UserDevice & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserDevice, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<UserDevice>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserDevice> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
