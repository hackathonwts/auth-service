import { Request } from 'express';
import { UserDocument } from '@modules/user/user.schema';
import { AuthService } from '../auth.service';
import { AdminLoginDto, ForgotPasswordDto, RefreshJwtDto, ResetPasswordDto, UpdateAdminProfileDto, ChangePasswordDto } from '../dto/auth.dto';
export declare class AdminController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: Request, dto: AdminLoginDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    forgotPassword(dto: ForgotPasswordDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    resetPassword(dto: ResetPasswordDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    refreshToken(dto: RefreshJwtDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    profileDetails(user: Partial<UserDocument>): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    logout(req: Request, user: Partial<UserDocument>): Promise<import("../../../common/types/api-response.type").ApiResponse>;
}
export declare class AdminProfileController {
    private readonly authService;
    constructor(authService: AuthService);
    updateProfile(user: Partial<UserDocument>, dto: UpdateAdminProfileDto, files: Express.Multer.File[]): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    changePassword(user: Partial<UserDocument>, dto: ChangePasswordDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
}
