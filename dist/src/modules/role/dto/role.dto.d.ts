import { Types } from 'mongoose';
export declare enum RoleGroupEnum {
    BACKEND = "backend",
    FRONTEND = "frontend"
}
export declare class RoleListingDto {
    roleGroup?: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortField?: string;
    sortOrder?: string;
}
export declare class SaveRoleDto {
    role: string;
    roleGroup: string;
    roleDisplayName: string;
    permissions: Types.ObjectId[];
}
export declare class UpdateRoleDto {
    role: string;
    roleGroup: string;
    roleDisplayName: string;
    permissions: Types.ObjectId[];
}
export declare class StatusRoleDto {
    status: string;
}
