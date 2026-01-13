import { Schema as MongoSchema, HydratedDocument, Types } from "mongoose";
export declare class RefreshToken {
    hash: string;
    userId: string | Types.ObjectId;
    createdAt: Date;
}
export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export declare const RefreshTokenSchema: MongoSchema<RefreshToken, import("mongoose").Model<RefreshToken, any, any, any, import("mongoose").Document<unknown, any, RefreshToken, any, {}> & RefreshToken & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RefreshToken, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<RefreshToken>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<RefreshToken> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
