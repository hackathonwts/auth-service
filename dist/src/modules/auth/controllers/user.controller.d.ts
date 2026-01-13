import { Request } from 'express';
import { UserDocument } from '@modules/user/user.schema';
import { AuthService } from '../auth.service';
import { AppleSocialAuthDto, FacebookSocialAuthDto, ForgotPasswordDto, GoogleSocialAuthDto, RefreshJwtDto, ResendOTPDto, ResetPasswordDto, SignupDto, UserOnboardingDto, VerifyOTPDto } from '../dto/auth.dto';
import { MulterS3File } from '@common/types/multer-s3-file';
export declare class UserController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(req: Request, dto: SignupDto, files: MulterS3File[]): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    resendOtp(dto: ResendOTPDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    verifyEmail(req: Request, dto: VerifyOTPDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    googleSocialAuth(dto: GoogleSocialAuthDto, req: Request): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    facebookSocialAuth(dto: FacebookSocialAuthDto, req: Request): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    appleSocialAuth(dto: AppleSocialAuthDto, req: Request): Promise<import("../../../common/types/api-response.type").ApiResponse | {
        success: boolean;
        message: string;
        data: any;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    resetPassword(dto: ResetPasswordDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    refreshToken(dto: RefreshJwtDto): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    profileDetails(user: Partial<UserDocument>): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    onboarding(user: Partial<UserDocument>, dto: UserOnboardingDto, files: {
        mainPhoto?: MulterS3File[];
        galleryPhotos?: MulterS3File[];
    }): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    deleteAccount(user: Partial<UserDocument>): Promise<import("../../../common/types/api-response.type").ApiResponse>;
    logout(req: Request, user: Partial<UserDocument>): Promise<import("../../../common/types/api-response.type").ApiResponse>;
}
