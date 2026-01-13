import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { GenderEnum, LookingForEnum, PreferredGenderEnum, VerificationTypeEnum } from '@common/enum/common.enum';

export class AdminLoginDto {
  @ApiProperty({ description: 'Email address', required: true })
  @IsEmail({}, { message: 'Please enter a valid email!' })
  @IsNotEmpty({ message: 'Email address is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim().toLowerCase() : String(value)))
  email: string;

  @ApiProperty({ description: 'Password', required: true })
  @IsNotEmpty({ message: 'Password is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  password: string;

  @ApiPropertyOptional({ description: 'Device Token' })
  @IsOptional()
  @IsNotEmpty({ message: 'Device token should not be empty!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  deviceToken?: string;
}

export class UserLoginDto {
  @ApiProperty({ description: 'Email address', required: true })
  @IsEmail({}, { message: 'Please enter a valid email!' })
  @IsNotEmpty({ message: 'Email address is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim().toLowerCase() : String(value)))
  email: string;

  @ApiProperty({ description: 'Password', required: true })
  @IsNotEmpty({ message: 'Password is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  password: string;

  @ApiPropertyOptional({ description: 'Device Token' })
  @IsOptional()
  @IsNotEmpty({ message: 'Device token should not be empty!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  deviceToken?: string;
}

export class UserPhoneLoginDto {
  @ApiProperty({ description: 'Country code (e.g. +91)', required: true })
  @IsString()
  @IsNotEmpty({ message: 'Country code is required!' })
  countryCode: string;

  @ApiProperty({ description: 'Phone number', required: true })
  @IsString()
  @Matches(/^\d{6,15}$/, { message: 'Invalid phone number!' })
  @IsNotEmpty({ message: 'Phone number is required!' })
  phone: string;
}

export class RefreshJwtDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Access token to reach private urls' })
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Token to refresh whole pair' })
  refreshToken: string;
}

export class SignupDto {
  @ApiProperty({ description: 'Full name of user' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'Full name is required!' })
  fullName: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please enter a valid email!' })
  // @IsNotEmpty({ message: 'Email is required!' })
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'Country code (e.g. +91)' })
  @IsString()
  @IsNotEmpty({ message: 'Country code is required!' })
  countryCode: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  @Matches(/^\d{6,15}$/, { message: 'Invalid phone number!' })
  @IsNotEmpty({ message: 'Phone number is required!' })
  phone: string;

  @ApiProperty({ description: 'Date of birth (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Invalid DOB format!' })
  @IsNotEmpty({ message: 'Date of birth is required!' })
  dob: string;

  @ApiProperty({ enum: GenderEnum, description: 'Gender' })
  @IsEnum(GenderEnum, { message: 'Invalid gender value!' })
  gender: GenderEnum;

  @ApiPropertyOptional({
    description: 'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  password: string;


  @ApiPropertyOptional({ description: 'Device token for push notification' })
  @IsOptional()
  @IsString()
  deviceToken?: string;

  @ApiPropertyOptional({
    description: 'Profile image (jpg, jpeg, png)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  profileImage?: any;
}

class ProfileQuestionDto {
  @ApiProperty({ description: 'Question ID' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ description: 'User answer' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}

class LocationPreferenceDto {
  @ApiProperty({ description: 'Discovery range in KM (1–100)' })
  @IsInt()
  @Min(1)
  @Max(100)
  rangeKm: number;

  @ApiPropertyOptional({ description: 'Allow nearby city matches' })
  @IsOptional()
  @IsBoolean()
  allowNearbyCities?: boolean;
}

export class UserOnboardingDto {
  @ApiPropertyOptional({ description: 'Short bio (max 250 chars)' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  bio?: string;

  @ApiProperty({
    description: 'Main profile photo',
    type: 'string',
    format: 'binary',
  }) 
  mainPhoto: any;

  @ApiPropertyOptional({
    description: 'Gallery photos (2–5 images)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  galleryPhotos?: any[];

  @ApiProperty({
    description: 'Interest category IDs',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  interests: string[];

  @ApiProperty({ enum: PreferredGenderEnum })
  @IsEnum(PreferredGenderEnum)
  preferredGender: PreferredGenderEnum;

  @ApiPropertyOptional({
    enum: LookingForEnum,
    description: 'Looking for Solo meetup, Crew meetup, or both',
  })
  @IsEnum(LookingForEnum)
  @IsOptional()
  lookingFor: LookingForEnum;

  @ApiProperty({ type: LocationPreferenceDto })
  @ValidateNested()
  @Type(() => LocationPreferenceDto)
  locationPreference: LocationPreferenceDto;

  @ApiPropertyOptional({
    type: [ProfileQuestionDto],
    description: 'Optional onboarding questions',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileQuestionDto)
  questions?: ProfileQuestionDto[];

  @ApiPropertyOptional({ description: 'Profile visibility' })
  @IsOptional()
  @IsBoolean()
  isProfileVisible?: boolean = true;

  @ApiPropertyOptional({ description: 'Show age on profile' })
  @IsOptional()
  @IsBoolean()
  showAge?: boolean = true;
}

export class FaceVerificationDto {
  @ApiProperty({
    description: 'Face image (jpg, png, jpeg)',
    type: 'string',
    format: 'binary',
  })
  faceImage: any;
}

export class GoogleSocialAuthDto {
  @ApiProperty({ description: 'Google ID Token', required: true })
  @IsNotEmpty({ message: 'Google ID Token is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  idToken: string;
}

export class FacebookSocialAuthDto {
  @ApiProperty({ description: 'Facebook Access Token', required: true })
  @IsNotEmpty({ message: 'Facebook Access Token is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  accessToken: string;
}

export class AppleSocialAuthDto {
  @ApiProperty({ description: 'Facebook Access Token', required: true })
  @IsNotEmpty({ message: 'Facebook Access Token is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  code: string;

  @ApiPropertyOptional({ description: 'Full Name' })
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Email Address' })
  @IsOptional()
  email?: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email address', required: true })
  @IsEmail({}, { message: 'Please enter a valid email!' })
  @IsNotEmpty({ message: 'Email address is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim().toLowerCase() : String(value)))
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset password token', required: true })
  @IsNotEmpty({ message: 'Reset password token is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  resetPasswordToken: string;

  @ApiProperty({ description: 'New password must be at least 8 characters long and contain at least one letter and one number.', required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @IsNotEmpty({ message: 'New password is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password', required: true })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @ApiProperty({ description: 'New password must be at least 8 characters long and contain at least one letter and one number.', required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'New password is required' })
  password: string;
}

export class UpdateSettingsDto {
  //user settings
  @ApiPropertyOptional({ description: 'Email Notifications Enabled' })
  @IsBoolean()
  emailNotifications: boolean;

  @ApiPropertyOptional({ description: 'SMS Notifications Enabled' })
  @IsBoolean()
  smsNotifications: boolean;

  @ApiPropertyOptional({ description: 'Push Notifications Enabled' })
  @IsBoolean()
  pushNotifications: boolean;

  @ApiPropertyOptional({ description: 'Email Reminders Enabled' })
  @IsBoolean()
  emailReminders: boolean;

  @ApiPropertyOptional({ description: 'SMS Reminders Enabled' })
  @IsBoolean()
  smsReminders: boolean;

  @ApiPropertyOptional({ description: 'Push Reminders Enabled' })
  @IsBoolean()
  pushReminders: boolean;
}

export class UpdateAdminProfileDto {
  @ApiPropertyOptional({ description: 'Email address' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value)))
  @IsEmail({}, { message: 'Please enter a valid email!' })
  @IsNotEmpty({ message: 'Email address is required!' })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'Phone number is required!' })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ description: 'Full Name' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'Full Name is required!' })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({ description: 'User Name' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value?.trim() : String(value)))
  @IsNotEmpty({ message: 'User Name is required!' })
  @IsOptional()
  userName: string;

  @ApiPropertyOptional({
    description: 'Profile image (jpg, png, jpeg)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  profileImage?: string;
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ description: 'Full name of user' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'Full name is required' })
  fullName?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase())
  @IsEmail({}, { message: 'Please enter a valid email!' })
  @IsNotEmpty({ message: 'Email address is required!' })
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Country code for phone number',
  })
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({
    description: 'Profile image (jpg, png, jpeg)',
    type: 'string',
    format: 'binary',
  })
  profileImage?: string;

  @ApiPropertyOptional({
    description: 'User bio',
    example: 'Always learning and growing',
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  @Transform(({ value }) => value?.trim())
  bio?: string;

  @ApiPropertyOptional({
    description: 'Preferred matching gender',
    enum: PreferredGenderEnum,
  })
  @IsOptional()
  @IsEnum(PreferredGenderEnum)
  preferredGender?: PreferredGenderEnum;

  @ApiPropertyOptional({
    description: 'Location range in km',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : value))
  @IsInt()
  @Min(1)
  @Max(100)
  locationRange?: number;
}

export class VerifyOTPDto {
  @ApiProperty({ description: 'Verify OTP token', required: true })
  @IsNotEmpty({ message: 'Verify OTP token is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  token: string;

  @ApiProperty({ description: 'OTP', required: true })
  @IsNotEmpty({ message: 'OTP is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  otp: string;

  @ApiProperty({ description: 'Type of verification', required: true, enum: VerificationTypeEnum })
  @IsEnum(VerificationTypeEnum, { message: 'Invalid verification type!' })
  type: VerificationTypeEnum;
}

export class ResendOTPDto {
  @ApiProperty({ description: 'Verify OTP token', required: true })
  @IsNotEmpty({ message: 'Verify OTP token is required!' })
  @Transform(({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : String(value)))
  token: string;
}























