import { GenderEnum, LookingForEnum, PreferredGenderEnum, VerificationTypeEnum } from '@common/enum/common.enum';
export declare class AdminLoginDto {
    email: string;
    password: string;
    deviceToken?: string;
}
export declare class UserLoginDto {
    email: string;
    password: string;
    deviceToken?: string;
}
export declare class UserPhoneLoginDto {
    countryCode: string;
    phone: string;
}
export declare class RefreshJwtDto {
    accessToken: string;
    refreshToken: string;
}
export declare class SignupDto {
    fullName: string;
    email: string;
    countryCode: string;
    phone: string;
    dob: string;
    gender: GenderEnum;
    password: string;
    deviceToken?: string;
    profileImage?: any;
}
declare class ProfileQuestionDto {
    questionId: string;
    answer: string;
}
declare class LocationPreferenceDto {
    rangeKm: number;
    allowNearbyCities?: boolean;
}
export declare class UserOnboardingDto {
    bio?: string;
    mainPhoto: any;
    galleryPhotos?: any[];
    interests: string[];
    preferredGender: PreferredGenderEnum;
    lookingFor: LookingForEnum;
    locationPreference: LocationPreferenceDto;
    questions?: ProfileQuestionDto[];
    isProfileVisible?: boolean;
    showAge?: boolean;
}
export declare class FaceVerificationDto {
    faceImage: any;
}
export declare class GoogleSocialAuthDto {
    idToken: string;
}
export declare class FacebookSocialAuthDto {
    accessToken: string;
}
export declare class AppleSocialAuthDto {
    code: string;
    fullName?: string;
    email?: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    resetPasswordToken: string;
    newPassword: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    password: string;
}
export declare class UpdateSettingsDto {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    emailReminders: boolean;
    smsReminders: boolean;
    pushReminders: boolean;
}
export declare class UpdateAdminProfileDto {
    email: string;
    phone: string;
    fullName: string;
    userName: string;
    profileImage?: string;
}
export declare class UpdateUserProfileDto {
    fullName?: string;
    email?: string;
    phone?: string;
    countryCode?: string;
    profileImage?: string;
    bio?: string;
    preferredGender?: PreferredGenderEnum;
    locationRange?: number;
}
export declare class VerifyOTPDto {
    token: string;
    otp: string;
    type: VerificationTypeEnum;
}
export declare class ResendOTPDto {
    token: string;
}
export {};
