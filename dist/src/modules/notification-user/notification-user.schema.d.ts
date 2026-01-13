import { HydratedDocument, Schema as MongoSchema, Types } from 'mongoose';
export declare class NotificationUser {
    notificationId: string | Types.ObjectId;
    userId: string | Types.ObjectId;
    isRead: boolean;
    isDeleted: boolean;
    isDelivered: boolean;
}
export declare const NotificationUserSchema: MongoSchema<NotificationUser, import("mongoose").Model<NotificationUser, any, any, any, import("mongoose").Document<unknown, any, NotificationUser, any, {}> & NotificationUser & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NotificationUser, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<NotificationUser>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<NotificationUser> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type NotificationUserDocument = NotificationUser & HydratedDocument<NotificationUser>;
