import { Types } from 'mongoose';
import { RoleGroup } from '@common/enum/user-role.enum';
export declare class CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    role: string;
    profileImage?: string;
}
export declare class UpdateUserDto {
    email: string;
    fullName: string;
    userName: string;
    role: Types.ObjectId | string;
    profileImage?: string;
}
export declare class ListingUserDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortField?: string;
    sortOrder?: string;
    roleId?: string;
    role?: string;
    roleGroup?: RoleGroup;
}
export declare class UpdateUserStatusDto {
    status: string;
}
export declare class UpdateUserPasswordDto {
    password: string;
}
