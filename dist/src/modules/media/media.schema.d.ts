import { HydratedDocument } from 'mongoose';
export type MediaDocument = HydratedDocument<Media>;
export declare enum MediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    DOCUMENT = "DOCUMENT",
    AUDIO = "AUDIO"
}
export declare enum MediaStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare class Media {
    userID: string;
    originalName: string;
    fileName: string;
    mimeType: string;
    extension: string;
    size: number;
    url: string;
    bucket?: string;
    key?: string;
    type: MediaType;
    width?: number;
    height?: number;
    duration?: number;
    uploadedBy?: string;
    tags?: string[];
    status: MediaStatus;
    isDeleted: boolean;
}
export declare const MediaSchema: import("mongoose").Schema<Media, import("mongoose").Model<Media, any, any, any, import("mongoose").Document<unknown, any, Media, any, {}> & Media & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Media, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Media>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Media> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
