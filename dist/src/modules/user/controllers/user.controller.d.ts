import { UserService } from '../user.service';
import { UserDocument } from '../user.schema';
import { ChangePasswordDto, UpdateSettingsDto, UpdateUserProfileDto } from '@modules/auth/dto/auth.dto';
import { MulterS3File } from '@common/types/multer-s3-file';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    updateProfile(user: Partial<UserDocument>, dto: UpdateUserProfileDto, files: MulterS3File[]): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    updateSettings(user: Partial<UserDocument>, dto: UpdateSettingsDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    changePassword(user: Partial<UserDocument>, dto: ChangePasswordDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    getGalleryImages(user: Partial<UserDocument>): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    deleteGalleryImage(user: Partial<UserDocument>, imageId: string): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    addGalleryImages(user: Partial<UserDocument>, files: MulterS3File[]): Promise<import("../../../common/types/api-response.type").ApiResponse>;
}
