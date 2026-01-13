import { HydratedDocument } from 'mongoose';
import { PermissionAction } from '../dto/permission.dto';
export declare class Permission {
    key: string;
    module: string;
    action: PermissionAction;
    description?: string;
    isActive: boolean;
}
export type PermissionDocument = HydratedDocument<Permission>;
export declare const PermissionSchema: import("mongoose").Schema<Permission, import("mongoose").Model<Permission, any, any, any, import("mongoose").Document<unknown, any, Permission, any, {}> & Permission & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Permission, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Permission>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Permission> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
