import { Document } from 'mongoose';
export type NotificationDocument = Notification & Document;
export declare enum NotificationType {
    GENERAL = "general",
    SYSTEM = "system",
    EVENT = "event",
    PROMOTION = "promotion"
}
export declare enum NotificationAudience {
    ALL = "all",
    USERS = "users",
    ADMINS = "admins",
    CUSTOM = "custom"
}
export declare class Notification {
    title: string;
    message?: string;
    thumbnail?: string;
    type: NotificationType;
    audience: NotificationAudience;
    gateways: string[];
    metadata?: Record<string, any>;
    deliverAt?: Date | string;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification, any, {}> & Notification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Notification> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
