import { HydratedDocument } from 'mongoose';
export type CmsDocument = HydratedDocument<Cms>;
export declare class Cms {
    title: string;
    slug: string;
    content: string;
    status: string;
    isDeleted: boolean;
}
export declare const CmsSchema: import("mongoose").Schema<Cms, import("mongoose").Model<Cms, any, any, any, import("mongoose").Document<unknown, any, Cms, any, {}> & Cms & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cms, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Cms>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Cms> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
