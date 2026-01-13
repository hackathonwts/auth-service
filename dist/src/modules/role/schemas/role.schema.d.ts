import { Permission } from '@modules/permission/permission';
import { HydratedDocument, Types } from 'mongoose';
export declare class Role {
    role: string;
    roleDisplayName: string;
    roleGroup: string;
    description: string;
    status: string;
    permissions: Permission[];
    isDeleted: boolean;
}
export type RoleDocument = HydratedDocument<Role>;
export declare const RoleSchema: import("mongoose").Schema<Role, import("mongoose").Model<Role, any, any, any, import("mongoose").Document<unknown, any, Role, any, {}> & Role & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Role, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Role>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Role> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
