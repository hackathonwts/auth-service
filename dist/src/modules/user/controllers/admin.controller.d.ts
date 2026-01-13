import { CreateUserDto, ListingUserDto, UpdateUserPasswordDto, UpdateUserDto, UpdateUserStatusDto } from '@modules/user/user.dto';
import { UserService } from '../user.service';
export declare class AdminController {
    private readonly userService;
    constructor(userService: UserService);
    getUsers(dto: ListingUserDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    createUser(dto: CreateUserDto, files: Express.Multer.File[]): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    getUser(userId: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    updateUserProfile(userId: string, dto: UpdateUserDto, files: Express.Multer.File[]): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    updateUserStatus(userId: string, dto: UpdateUserStatusDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    resetUserPassword(userId: string, dto: UpdateUserPasswordDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    deleteUser(userId: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    deleteUsers(dto: {
        userIds: string[];
    }): Promise<import("../../../common/types/api-response.type").ApiResponse>;
}
