"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOTPDto = exports.VerifyOTPDto = exports.UpdateUserProfileDto = exports.UpdateAdminProfileDto = exports.UpdateSettingsDto = exports.ChangePasswordDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.AppleSocialAuthDto = exports.FacebookSocialAuthDto = exports.GoogleSocialAuthDto = exports.FaceVerificationDto = exports.UserOnboardingDto = exports.SignupDto = exports.RefreshJwtDto = exports.UserPhoneLoginDto = exports.UserLoginDto = exports.AdminLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const common_enum_1 = require("../../../common/enum/common.enum");
class AdminLoginDto {
}
exports.AdminLoginDto = AdminLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', required: true }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : String(value))),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device Token' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Device token should not be empty!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "deviceToken", void 0);
class UserLoginDto {
}
exports.UserLoginDto = UserLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', required: true }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : String(value))),
    __metadata("design:type", String)
], UserLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], UserLoginDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device Token' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Device token should not be empty!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], UserLoginDto.prototype, "deviceToken", void 0);
class UserPhoneLoginDto {
}
exports.UserPhoneLoginDto = UserPhoneLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country code (e.g. +91)', required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Country code is required!' }),
    __metadata("design:type", String)
], UserPhoneLoginDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{6,15}$/, { message: 'Invalid phone number!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number is required!' }),
    __metadata("design:type", String)
], UserPhoneLoginDto.prototype, "phone", void 0);
class RefreshJwtDto {
}
exports.RefreshJwtDto = RefreshJwtDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ description: 'Access token to reach private urls' }),
    __metadata("design:type", String)
], RefreshJwtDto.prototype, "accessToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ description: 'Token to refresh whole pair' }),
    __metadata("design:type", String)
], RefreshJwtDto.prototype, "refreshToken", void 0);
class SignupDto {
}
exports.SignupDto = SignupDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name of user' }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full name is required!' }),
    __metadata("design:type", String)
], SignupDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email address' }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignupDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country code (e.g. +91)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Country code is required!' }),
    __metadata("design:type", String)
], SignupDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{6,15}$/, { message: 'Invalid phone number!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number is required!' }),
    __metadata("design:type", String)
], SignupDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of birth (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid DOB format!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Date of birth is required!' }),
    __metadata("design:type", String)
], SignupDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: common_enum_1.GenderEnum, description: 'Gender' }),
    (0, class_validator_1.IsEnum)(common_enum_1.GenderEnum, { message: 'Invalid gender value!' }),
    __metadata("design:type", String)
], SignupDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Password must be at least 8 characters long and contain at least one letter and one number',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long!' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
        message: 'Password must contain at least one letter and one number!',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device token for push notification' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupDto.prototype, "deviceToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profile image (jpg, jpeg, png)',
        type: 'string',
        format: 'binary',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SignupDto.prototype, "profileImage", void 0);
class ProfileQuestionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Question ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProfileQuestionDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User answer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProfileQuestionDto.prototype, "answer", void 0);
class LocationPreferenceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discovery range in KM (1–100)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], LocationPreferenceDto.prototype, "rangeKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Allow nearby city matches' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LocationPreferenceDto.prototype, "allowNearbyCities", void 0);
class UserOnboardingDto {
    constructor() {
        this.isProfileVisible = true;
        this.showAge = true;
    }
}
exports.UserOnboardingDto = UserOnboardingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Short bio (max 250 chars)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(250),
    __metadata("design:type", String)
], UserOnboardingDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Main profile photo',
        type: 'string',
        format: 'binary',
    }),
    __metadata("design:type", Object)
], UserOnboardingDto.prototype, "mainPhoto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Gallery photos (2–5 images)',
        type: 'array',
        items: { type: 'string', format: 'binary' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UserOnboardingDto.prototype, "galleryPhotos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Interest category IDs',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UserOnboardingDto.prototype, "interests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: common_enum_1.PreferredGenderEnum }),
    (0, class_validator_1.IsEnum)(common_enum_1.PreferredGenderEnum),
    __metadata("design:type", String)
], UserOnboardingDto.prototype, "preferredGender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: common_enum_1.LookingForEnum,
        description: 'Looking for Solo meetup, Crew meetup, or both',
    }),
    (0, class_validator_1.IsEnum)(common_enum_1.LookingForEnum),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserOnboardingDto.prototype, "lookingFor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: LocationPreferenceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationPreferenceDto),
    __metadata("design:type", LocationPreferenceDto)
], UserOnboardingDto.prototype, "locationPreference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [ProfileQuestionDto],
        description: 'Optional onboarding questions',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProfileQuestionDto),
    __metadata("design:type", Array)
], UserOnboardingDto.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Profile visibility' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserOnboardingDto.prototype, "isProfileVisible", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show age on profile' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserOnboardingDto.prototype, "showAge", void 0);
class FaceVerificationDto {
}
exports.FaceVerificationDto = FaceVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Face image (jpg, png, jpeg)',
        type: 'string',
        format: 'binary',
    }),
    __metadata("design:type", Object)
], FaceVerificationDto.prototype, "faceImage", void 0);
class GoogleSocialAuthDto {
}
exports.GoogleSocialAuthDto = GoogleSocialAuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Google ID Token', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Google ID Token is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], GoogleSocialAuthDto.prototype, "idToken", void 0);
class FacebookSocialAuthDto {
}
exports.FacebookSocialAuthDto = FacebookSocialAuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Facebook Access Token', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Facebook Access Token is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], FacebookSocialAuthDto.prototype, "accessToken", void 0);
class AppleSocialAuthDto {
}
exports.AppleSocialAuthDto = AppleSocialAuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Facebook Access Token', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Facebook Access Token is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], AppleSocialAuthDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Full Name' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AppleSocialAuthDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email Address' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AppleSocialAuthDto.prototype, "email", void 0);
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', required: true }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : String(value))),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reset password token', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Reset password token is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New password must be at least 8 characters long and contain at least one letter and one number.', required: true }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long!' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
        message: 'Password must contain at least one letter and one number!',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'New password is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current password', required: true }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Current password is required' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New password must be at least 8 characters long and contain at least one letter and one number.', required: true }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long!' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
        message: 'Password must contain at least one letter and one number!',
    }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'New password is required' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "password", void 0);
class UpdateSettingsDto {
}
exports.UpdateSettingsDto = UpdateSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email Notifications Enabled' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "emailNotifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'SMS Notifications Enabled' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "smsNotifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Push Notifications Enabled' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "pushNotifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email Reminders Enabled' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "emailReminders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'SMS Reminders Enabled' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "smsReminders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Push Reminders Enabled' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "pushReminders", void 0);
class UpdateAdminProfileDto {
}
exports.UpdateAdminProfileDto = UpdateAdminProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email address' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value))),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Full Name' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full Name is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User Name' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value?.trim() : String(value))),
    (0, class_validator_1.IsNotEmpty)({ message: 'User Name is required!' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profile image (jpg, png, jpeg)',
        type: 'string',
        format: 'binary',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "profileImage", void 0);
class UpdateUserProfileDto {
}
exports.UpdateUserProfileDto = UpdateUserProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Full name of user' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full name is required' }),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim() && value?.toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required!' }),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Country code for phone number',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profile image (jpg, png, jpeg)',
        type: 'string',
        format: 'binary',
    }),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User bio',
        example: 'Always learning and growing',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(250),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred matching gender',
        enum: common_enum_1.PreferredGenderEnum,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(common_enum_1.PreferredGenderEnum),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "preferredGender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location range in km',
        example: 10,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value !== undefined ? Number(value) : value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateUserProfileDto.prototype, "locationRange", void 0);
class VerifyOTPDto {
}
exports.VerifyOTPDto = VerifyOTPDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Verify OTP token', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Verify OTP token is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], VerifyOTPDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OTP', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'OTP is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], VerifyOTPDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of verification', required: true, enum: common_enum_1.VerificationTypeEnum }),
    (0, class_validator_1.IsEnum)(common_enum_1.VerificationTypeEnum, { message: 'Invalid verification type!' }),
    __metadata("design:type", String)
], VerifyOTPDto.prototype, "type", void 0);
class ResendOTPDto {
}
exports.ResendOTPDto = ResendOTPDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Verify OTP token', required: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Verify OTP token is required!' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : String(value))),
    __metadata("design:type", String)
], ResendOTPDto.prototype, "token", void 0);
