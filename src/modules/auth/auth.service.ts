import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from '@common/types/api-response.type';
import { RefreshToken } from '@modules/refresh-token/schemas/refresh-token.schema';
import { RoleRepository } from '@modules/role/repositories/role.repository';
import { UserRepository } from '@modules/user/user.repository';
import { Types } from 'mongoose';
import {
  AdminLoginDto,
  AppleSocialAuthDto,
  ChangePasswordDto,
  FaceVerificationDto,
  ForgotPasswordDto,
  RefreshJwtDto,
  ResendOTPDto,
  ResetPasswordDto,
  SignupDto,
  UpdateAdminProfileDto,
  UserOnboardingDto,
  VerifyOTPDto,
} from './dto/auth.dto';
import { RefreshTokenRepository } from '@modules/refresh-token/repository/refresh-token.repository';
import { JwtPayloadType } from '@common/types/jwt.type';
import { Messages } from '@common/constants/messages';
import { UserDocument } from '@modules/user/user.schema';
import { UserDevice } from '@modules/user-devices/schemas/user-device.schema';
import { getClientIp } from 'request-ip';
import { lookup } from 'geoip-lite';
import { Request } from 'express';
import { UserDeviceRepository } from '@modules/user-devices/repository/user-device.repository';
import { WinstonLoggerService } from '@common/logger/winston.logger';
import { createCipheriv, createDecipheriv } from 'node:crypto';
import { errorResponse, successResponse } from '@helpers/response.helper';
import { RoleGroup, UserRole } from '@common/enum/user-role.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  AppleProfile,
  AppleUserData,
  downloadAndSaveImage,
  generateAppleClientSecret,
  getAppleIdToken,
  getFacebookProfile,
  SocialUserProfile,
  verifyAppleIdentityToken,
  verifyGoogleIdToken,
} from '@helpers/social-auth.helper';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { decryptCipherToken, encryptCipherToken, generateOtp } from '@helpers/utils.helper';
import { VerificationTypeEnum } from '@common/enum/common.enum';
import { MulterS3File } from '@common/types/multer-s3-file';

type RegisterViaSource = 'EMAIL' | 'PHONE';

@Injectable()
export class AuthService {
  winston: WinstonLoggerService;
  private readonly applePrivateKey: string;

  constructor(
    @InjectQueue('mail-queue') private readonly mailQueue: Queue,
    private readonly configService: ConfigService,
    private readonly roleRepository: RoleRepository,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly userDeviceRepository: UserDeviceRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    this.winston = new WinstonLoggerService();
    // Load Apple private key once during service initialization
    const privateKeyPath = this.configService.get<string>('APPLE_PRIVATE_KEY_PATH');
    if (privateKeyPath) {
      try {
        this.applePrivateKey = readFileSync(privateKeyPath, 'utf8');
      } catch (error) {
        console.error('Failed to load Apple private key:', error);
      }
    }
  }

  // ========== Private Methods ===========//
  private async generateRefreshToken(accessToken: string, userId: string | Types.ObjectId): Promise<string> {
    const salt = await genSalt(10);
    const refreshToken = new RefreshToken();
    refreshToken.userId = userId;
    refreshToken.hash = await hash(accessToken.split('.')[2] + salt, salt);
    await this.refreshTokenRepository.save(refreshToken);
    return salt;
  }

  private async login(req: Request, user: Partial<UserDocument>): Promise<ApiResponse> {
    try {  
      const tokenPayload: JwtPayloadType = { userId: user._id.toJSON() };
      const accessToken = this.jwtService.sign(tokenPayload);
      const refreshToken = await this.generateRefreshToken(accessToken, user._id);

      const ip = getClientIp(req);
      const geoIpInfo = ip ? lookup(ip) : null;
      if (ip) {
        const existingDeviceData = await this.userDeviceRepository.getByField({ accessToken: accessToken });
        const { ll, region, country, city, timezone } = geoIpInfo ?? {};
        const deviceInfo: Partial<UserDevice> = {
          ip,
          ip_lat: ll?.[0]?.toString() || '',
          ip_long: ll?.[1]?.toString() || '',
          last_active: Date.now(),
          state: region || '',
          country: country || '',
          city: city || '',
          timezone: timezone || '',
          user_id: user._id,
          accessToken: accessToken,
          deviceToken: req.body.deviceToken ?? '',
        };
        await this.userDeviceRepository.saveOrUpdate(deviceInfo, existingDeviceData?._id);
      }

      // return response
      return successResponse(
        {
          user: user.toJSON(),
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        Messages.USER_LOGIN_SUCCESS,
      );
    } catch (err) {
      const stackTrace = (err as Error)?.stack?.split('\n')?.reverse()?.slice(0, -2)?.reverse()?.join('\n');
      this.winston.error(stackTrace, 'userLoginService');
      return errorResponse(Messages.SOMETHING_WENT_WRONG);
    }
  }

  private async signup(req: Request, body: Partial<UserDocument>): Promise<ApiResponse> {
    const saveUser = await this.userRepository.save(body);
    console.log('req', req.body);

    if (!saveUser?._id) throw new BadRequestException(saveUser instanceof Error ? saveUser?.message : Messages.SOMETHING_WENT_WRONG);

    const userDetails = await this.userRepository.getById(saveUser._id);
    if (!userDetails) throw new BadRequestException(Messages.USER_MISSING_ERROR);

    const registerViaSource: RegisterViaSource = 'PHONE';
    try {
      const otp = generateOtp(4);
      const expiresAt = Date.now() + 60 * 5 * 1000;
      const encryptedOtpToken = encryptCipherToken({
        userId: userDetails._id.toString(),
        otp,
        expiresAt: expiresAt,
        purpose: registerViaSource === 'PHONE' ? VerificationTypeEnum.PHONE_VERIFY : VerificationTypeEnum.EMAIL_VERIFY,
      });

      if (registerViaSource === 'PHONE') {
        //TODO: Send OTP via phone - Placeholder for SMS integration twilio, etc.
      } else if (registerViaSource === 'EMAIL') {
        // Send email
        const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_ADDRESS')}>`;

        await this.mailQueue.add(
          'send-email',
          {
            from,
            to: userDetails.email,
            subject: 'Verify Your Email Address',
            template: 'verify-email',
            locals: {
              project_name: this.configService.get('PROJECT_NAME'),
              otp: otp,
              name: userDetails.fullName ?? userDetails.firstName + ' ' + userDetails.lastName,
              expiryMinutes: 5,
            },
          },
          {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
          },
        );
      }
      const message = registerViaSource === 'PHONE' ? `${otp} OTP sent to registered phone number.` : `OTP sent to registered email address.`;
      return successResponse(
        {
          user: userDetails.toJSON(),
          token: encryptedOtpToken,
        },
        message,
      );
    } catch (err) {
      // if error occurs in any issue delete last inserted user
      await this.userRepository.delete(saveUser._id);
      const stackTrace = (err as Error)?.stack?.split('\n')?.reverse()?.slice(0, -2)?.reverse()?.join('\n');
      this.winston.error(stackTrace, 'userLoginService');
      return errorResponse(Messages.SOMETHING_WENT_WRONG);
    }
  }

  private async findOrCreateUserFromSocial(req: Request, profile: SocialUserProfile): Promise<ApiResponse> {
    if (!profile) throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);

    // Look up existing user by provider + providerId
    let user = await this.userRepository.getByField({
      socialProvider: profile.provider,
      socialProviderId: profile.id,
    });

    if (!user) {
      // Check if user exists with this email
      if (profile.email) {
        user = await this.userRepository.getByField({ email: profile.email });
      }
      if (user) {
        // Link social account to existing user
        user.socialProvider = profile.provider;
        user.socialProviderId = profile.id;

        // Download and update profile picture if available and not already set
        if (profile.picture && !user.profileImage) {
          const uploadDir = join(process.cwd(), 'uploads', 'users');
          const filename = `${user.id}-${profile.provider}.jpg`;
          const savedPath = await downloadAndSaveImage(profile.picture, uploadDir, filename);
          if (savedPath) {
            user.profileImage = savedPath;
          }
        }

        // Update user record and login
        await this.userRepository.updateById(user, user._id);
        return this.login(req, user);
      } else {
        // Create new user
        const newUser = {
          email: profile.email,
          emailVerified: profile.emailVerified ?? false,
          fullName: profile.name,
          firstName: profile.firstName,
          lastName: profile.lastName,
          socialProvider: profile.provider,
          socialProviderId: profile.id,
          profileImage: null, // Will be set below
        };

        // Download profile picture if available
        if (profile.picture) {
          const uploadDir = join(process.cwd(), 'uploads', 'users');
          // Generate unique filename using timestamp and provider
          const timestamp = Date.now();
          const filename = `${profile.provider}-${timestamp}.jpg`;
          const savedPath = await downloadAndSaveImage(profile.picture, uploadDir, filename);
          if (savedPath) {
            newUser.profileImage = savedPath;
          }
        }

        user = await this.userRepository.save(newUser);
      }
    }

    return this.login(req, user);
  }

  // ========== Public Methods ========== //
  public async userSignup(body: SignupDto, files: MulterS3File[], req: Request): Promise<ApiResponse> {
    const role = 'user';
    const getRole = await this.roleRepository.getByField({ role: role });
    if (!getRole?._id) throw new BadRequestException(Messages.ROLE_NOT_FOUND_ERROR);

    const userExists = await this.userRepository.getByField({
      phone: body.phone,
      isDeleted: false,
    });
    if (userExists?._id) throw new BadRequestException(Messages.USER_EXIST_ERROR);

    if (files?.length) {
      for (const file of files) {
        body[file.fieldname] = file.filename;
      }
    }

    (body as Partial<UserDocument>).role = getRole._id;

    return await this.signup(req, body);
  }

  public async socialLoginGoogle(req: Request, idToken: string) {
    try {
      const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      if (!clientId) {
        throw new Error('GOOGLE_CLIENT_ID not configured');
      }

      const profile = await verifyGoogleIdToken(idToken, clientId);
      return this.findOrCreateUserFromSocial(req, profile);
    } catch (error) {
      throw new Error(`Google authentication failed: ${error.message}`);
    }
  }

  public async socialLoginFacebook(req: Request, accessToken: string) {
    try {
      const appId = this.configService.get<string>('FACEBOOK_APP_ID');
      const appSecret = this.configService.get<string>('FACEBOOK_APP_SECRET');

      if (!appId || !appSecret) {
        throw new Error('Facebook credentials not configured');
      }

      const profile = await getFacebookProfile(accessToken, { appId, appSecret });
      return this.findOrCreateUserFromSocial(req, profile);
    } catch (error) {
      throw new Error(`Facebook authentication failed: ${error.message}`);
    }
  }

  public async socialLoginApple(req: Request, body: AppleSocialAuthDto) {
    try {
      const { code, fullName, email } = body;
      const clientId = this.configService.get<string>('APPLE_CLIENT_ID');
      const teamId = this.configService.get<string>('APPLE_TEAM_ID');
      const keyId = this.configService.get<string>('APPLE_KEY_ID');

      if (!clientId || !teamId || !keyId || !this.applePrivateKey) {
        throw new Error('Apple credentials not properly configured');
      }

      // Generate client secret
      const clientSecret = await generateAppleClientSecret({
        teamId: teamId,
        clientId: clientId,
        keyId: keyId,
        privateKey: this.applePrivateKey,
      });

      // Get apple id token
      const appleIdToken = await getAppleIdToken(code, clientId, clientSecret);
      if (!appleIdToken) throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);

      const userData: AppleUserData = {
        name: fullName ? { firstName: fullName.split(' ')[0], lastName: fullName.split(' ')[1] } : null,
        email: email,
      };
      // Verify identity token
      const profile: AppleProfile = await verifyAppleIdentityToken(appleIdToken, clientId, userData);
      return this.findOrCreateUserFromSocial(req, profile);
    } catch (err) {
      const stackTrace = (err as Error)?.stack?.split('\n')?.reverse()?.slice(0, -2)?.reverse()?.join('\n');
      this.winston.error(stackTrace, 'socialLoginApple');
      return errorResponse(Messages.SOMETHING_WENT_WRONG);
    }
  }

  public async adminLogin(req: Request, body: AdminLoginDto): Promise<ApiResponse> {
    const existsUser = await this.userRepository.getByField({
      email: body.email,
      isDeleted: false,
    });

    // Check if user exists
    if (!existsUser?._id) throw new BadRequestException(Messages.USER_MISSING_ERROR);

    // Check if password is correct
    if (!existsUser.validPassword(body.password)) {
      throw new BadRequestException(Messages.INVALID_CREDENTIALS_ERROR);
    }

    // Check if user role is a backend role
    const userRole = await this.roleRepository.getByField({
      _id: new Types.ObjectId(existsUser.role),
      isDeleted: false,
      roleGroup: RoleGroup.BACKEND,
    });

    console.log('userRole', userRole, {
            _id: new Types.ObjectId(existsUser.role),
      isDeleted: false,
      roleGroup: RoleGroup.BACKEND,
    });

    if (!userRole?._id) {
      throw new BadRequestException('User role not found or not a backend role!');
    }

    // Check if user is active
    if (existsUser.status === 'Inactive') {
      throw new BadRequestException(Messages.USER_INACTIVE_ERROR);
    }
    // Call login function
    return await this.login(req, existsUser);
  }
  public async adminSignup(body: SignupDto, files: Express.Multer.File[], req: Request): Promise<ApiResponse> {
    const role = 'admin';
    // Get admin role from  Role collection
    const getRole = await this.roleRepository.getByField({ role: role });
    if (!getRole?._id) throw new BadRequestException(Messages.ROLE_NOT_FOUND_ERROR);

    // Check if user email already exists
    const userExists = await this.userRepository.getByField({
      email: body.email,
      isDeleted: false,
    });
    if (userExists?._id) throw new BadRequestException(Messages.USER_EXIST_ERROR);

    //  Attach files in the user payload
    if (files?.length) {
      for (const file of files) {
        body[file.fieldname] = file.filename;
      }
    }

    // Attach role to user
    (body as Partial<UserDocument>).role = getRole._id;

    // Call signup function
    return await this.signup(req, body);
  }

  public async refreshToken(body: RefreshJwtDto): Promise<ApiResponse> {
    const { accessToken, refreshToken } = body;

    const tokenData = await this.userDeviceRepository.getByField({
      accessToken: accessToken,
      isLoggedOut: false,
      // "expired": true,
      isDeleted: false,
    });

    if (tokenData?._id) {
      const refreshTokenHash = await hash(body.accessToken.split('.')[2] + refreshToken, refreshToken);

      const refreshTokenData = await this.refreshTokenRepository.getByField({
        hash: refreshTokenHash,
      });
      if (!refreshTokenData) throw new BadRequestException(Messages.INVALID_TOKEN_ERROR);

      const user = await this.userRepository.getByField({ _id: new Types.ObjectId(refreshTokenData.userId), isDeleted: false, status: 'Active' });
      if (!user?._id) throw new BadRequestException(Messages.USER_MISSING_ERROR);

      const expiresDate = new Date(refreshTokenData.createdAt);
      expiresDate.setSeconds(expiresDate.getSeconds() + this.configService.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN'));
      if (refreshTokenData.createdAt > expiresDate) {
        await this.refreshTokenRepository.delete(refreshTokenData._id);
        throw new UnauthorizedException(Messages.REFRESH_TOKEN_EXPIRED_ERROR);
      }

      const payload: JwtPayloadType = { userId: refreshTokenData.userId.toString() };
      const newAccessToken = this.jwtService.sign(payload);
      const newRefreshToken = await genSalt(10);

      refreshTokenData.hash = await hash(newAccessToken.split('.')[2] + newRefreshToken, newRefreshToken);

      if (refreshTokenData) {
        await this.refreshTokenRepository.save(refreshTokenData);
      }

      const existingDeviceData = await this.userDeviceRepository.getByField({ accessToken: accessToken });

      if (existingDeviceData?._id) {
        await this.userDeviceRepository.updateById(
          {
            accessToken: newAccessToken,
          },
          existingDeviceData?._id,
        );
      }

      return successResponse({ accessToken: newAccessToken, refreshToken: newRefreshToken }, Messages.REFRESH_TOKEN_ISSUED_SUCCESS);
    } else {
      throw new UnauthorizedException('Token has been invalidated. Please log in again.');
    }
  }

  public async forgotPassword(body: ForgotPasswordDto): Promise<ApiResponse> {
    const existUser = await this.userRepository.getByField({
      email: body.email,
      isDeleted: false,
    });

    if (!existUser?._id) {
      throw new BadRequestException(Messages.USER_MISSING_ERROR);
    }

    if (existUser.status === 'Blocked') {
      throw new BadRequestException(Messages.USER_BLOCKED_ERROR);
    }
    const userRole = await this.roleRepository.getByField({
      _id: new Types.ObjectId(existUser.role),
      isDeleted: false,
    });

    if (!userRole?._id) {
      throw new BadRequestException('User role not found.');
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_ADDRESS')}>`;

    if (userRole.role === UserRole.ADMINISTRATOR) {
      const algorithm = this.configService.get<string>('CRYPTO_ALGORITHM');
      const key = Buffer.from(this.configService.get<string>('CRYPTO_AES_KEY'), 'hex');
      const iv = Buffer.from(this.configService.get<string>('CRYPTO_AES_IV'), 'hex');

      const cipher = createCipheriv(algorithm, key, iv);

      const payload = JSON.stringify({
        id: existUser._id,
        exp: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      let encrypted = cipher.update(payload, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      const resetPasswordToken = encrypted;

      // Choose base URL
      let baseUrl: string = this.configService.get<string>('USER_BASE_URL');
      if (userRole.roleGroup === RoleGroup.BACKEND) {
        baseUrl = this.configService.get<string>('ADMIN_BASE_URL');
      }

      const resetLink = `${baseUrl}/auth/reset-password/${encodeURIComponent(resetPasswordToken)}`;

      await this.mailQueue.add(
        'send-email',
        {
          from,
          to: existUser.email,
          subject: 'Password Reset Link',
          template: 'forgot-password',
          locals: {
            project_name: this.configService.get('PROJECT_NAME'),
            resetLink,
          },
        },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        },
      );

      await this.userRepository.updateById({ resetPasswordToken }, existUser._id);
      return successResponse(null, Messages.FORGOT_PASSWORD_SUCCESS);
    }

    const otp = generateOtp(4);
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const otpToken = encryptCipherToken({
      userId: existUser._id.toString(),
      otp,
      expiresAt,
      purpose: VerificationTypeEnum.FORGOT_PASSWORD,
    });

    const expiryHuman = '10 minutes';

    await this.mailQueue.add(
      'send-email',
      {
        from,
        to: existUser.email,
        subject: 'Password Reset OTP',
        template: 'forgot-password-user',
        locals: {
          project_name: this.configService.get('PROJECT_NAME'),
          otp,
          expiry: expiryHuman,
          name: existUser.fullName ?? existUser.firstName + ' ' + existUser.lastName,
        },
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );

    return successResponse({ otpToken }, 'OTP sent successfully.');
  }

  public async resetPassword(body: ResetPasswordDto): Promise<ApiResponse> {
    const { newPassword, resetPasswordToken } = body;

    let decoded: { id: string; exp: number };
    try {
      const algorithm = this.configService.get<string>('CRYPTO_ALGORITHM');
      const key = Buffer.from(this.configService.get<string>('CRYPTO_AES_KEY'), 'hex');
      const iv = Buffer.from(this.configService.get<string>('CRYPTO_AES_IV'), 'hex');

      const decipher = createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(resetPasswordToken, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      decoded = JSON.parse(decrypted);

      if (decoded.exp <= Date.now()) throw new BadRequestException(Messages.INVALID_TOKEN_ERROR);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new BadRequestException(Messages.INVALID_TOKEN_ERROR);
    }

    const user = await this.userRepository.getByField({
      _id: new Types.ObjectId(decoded.id),
      isDeleted: false,
    });
    if (!user?._id) throw new BadRequestException(Messages.USER_MISSING_ERROR);
    if (user.resetPasswordToken !== resetPasswordToken) {
      throw new BadRequestException(Messages.INVALID_TOKEN_ERROR);
    }
    await this.userRepository.updateById({ password: newPassword, resetPasswordToken: null }, user._id);

    return successResponse(null, Messages.PASSWORD_UPDATE_SUCCESS);
  }

  public async changePassword(userId: string, body: ChangePasswordDto): Promise<ApiResponse> {
    const userData = await this.userRepository.getById(userId);

    // Check old password match
    const oldPasswordMatch = userData.validPassword(body.currentPassword);
    if (!oldPasswordMatch) throw new BadRequestException('Old credential mis-matched!');

    // Check new password match with old password
    const newPassVsOldPass = userData.validPassword(body.password);
    if (newPassVsOldPass) throw new BadRequestException('New password cannot be same as your old password!');

    const userUpdate = await this.userRepository.updateById({ password: body.password }, userData._id);
    if (!userUpdate) {
      throw new BadRequestException(userUpdate);
    }

    return { success: true, message: 'User password updated successfully.', data: userUpdate };
  }

  public async getProfileDetails(userId: string): Promise<ApiResponse> {
    const userDetails = await this.userRepository.getUserDetails(userId);
    if (!userDetails?._id) throw new BadRequestException(Messages.USER_MISSING_ERROR);
    return successResponse(userDetails, 'Profile details retrieved successfully.');
  }

  public async updateProfileDetails(userId: string, body: UpdateAdminProfileDto, files: Express.Multer.File[]): Promise<ApiResponse> {
    const { email, phone } = body;
    const userDetails = await this.userRepository.getUserDetails(userId);
    if (!userDetails?._id) throw new BadRequestException(Messages.USER_MISSING_ERROR);

    if (email) {
      const isEmailExists = await this.userRepository.getByField({ email: { $regex: '^' + email + '$', $options: 'i' }, isDeleted: false, _id: { $ne: userId } });
      if (isEmailExists?._id) throw new ConflictException(Messages.USER_EXIST_ERROR);
    }
    if (phone) {
      const isPhoneExists = await this.userRepository.getByField({ phone: { $regex: '^' + phone + '$', $options: 'i' }, isDeleted: false, _id: { $ne: userId } });
      if (isPhoneExists?._id) throw new ConflictException(Messages.USER_EXIST_ERROR);
    }

    //  Attach files in the user payload
    if (files?.length) {
      // Delete previous files
      if (userDetails?.profileImage) {
        // TODO:: Delete previous files for public/uploads
      }
      for (const file of files) {
        body[file.fieldname] = file.filename;
      }
    }
    const updateData = await this.userRepository.updateById(body, new Types.ObjectId(userId));
    if (!updateData) throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);
    return successResponse(updateData, 'Profile updated successfully.');
  }

  public async resendOtp(dto: ResendOTPDto): Promise<ApiResponse> {
    const { userId, purpose } = decryptCipherToken(dto.token);

    const userDetails = await this.userRepository.getById(userId);
    if (!userDetails?._id) throw new BadRequestException(Messages.USER_MISSING_ERROR);

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_ADDRESS')}>`;
    const projectName = this.configService.get('PROJECT_NAME');
    const name = userDetails.fullName ?? `${userDetails.firstName} ${userDetails.lastName}`.trim();

    const createOtpToken = (ttlMs: number, _purpose: VerificationTypeEnum) => {
      const otp = generateOtp(4);
      const expiresAt = Date.now() + ttlMs;
      const token = encryptCipherToken({
        userId: userDetails._id.toString(),
        otp,
        expiresAt,
        purpose: _purpose,
      });
      return { otp, expiresAt, token };
    };

    try {
      if (purpose === VerificationTypeEnum.EMAIL_VERIFY) {
        if (userDetails.emailVerified) {
          throw new ConflictException('Email already verified. Please login.');
        }

        const { otp, token } = createOtpToken(60 * 5 * 1000, purpose);

        await this.mailQueue.add(
          'send-email',
          {
            from,
            to: userDetails.email,
            subject: 'Verify Your Email Address',
            template: 'verify-email',
            locals: {
              project_name: projectName,
              otp,
              name,
              expiryMinutes: 5,
            },
          },
          {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
          },
        );

        return successResponse({
          user: userDetails.toJSON(),
          token,
        });
      }

      if (purpose === VerificationTypeEnum.FORGOT_PASSWORD) {
        const { otp, token } = createOtpToken(10 * 60 * 1000, purpose);
        const expiryHuman = '10 minutes';

        await this.mailQueue.add(
          'send-email',
          {
            from,
            to: userDetails.email,
            subject: 'Password Reset OTP',
            template: 'forgot-password-user',
            locals: {
              project_name: projectName,
              otp,
              expiry: expiryHuman,
              name,
            },
          },
          {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
          },
        );

        return successResponse({ otpToken: token }, 'OTP sent successfully.');
      }

      if (purpose === VerificationTypeEnum.PHONE_VERIFY || purpose === VerificationTypeEnum.LOGIN_VERIFY) {
        const { otp, token } = createOtpToken(60 * 5 * 1000, purpose);

        return successResponse(
          {
            user: userDetails.toJSON(),
            token,
          },
          `${otp} OTP sent successfully.`,
        );
      }

      throw new BadRequestException('Invalid request parameters.');
    } catch (err) {
      const stackTrace = (err as Error)?.stack?.split('\n')?.reverse()?.slice(0, -2)?.reverse()?.join('\n');

      this.winston.error(stackTrace, 'resendOtpService');
      return errorResponse(Messages.SOMETHING_WENT_WRONG);
    }
  }

  public async verifyOtp(dto: VerifyOTPDto, req: Request): Promise<ApiResponse> {
    const { userId, otp, purpose, expiresAt } = decryptCipherToken(dto.token);

    if (!userId || !otp || !expiresAt || !purpose) {
      throw new BadRequestException('Invalid token.');
    }

    if (purpose !== dto.type) {
      throw new BadRequestException('Invalid OTP token type.');
    }

    if (Date.now() > expiresAt) {
      throw new BadRequestException('OTP expired');
    }

    if (otp !== dto.otp) {
      throw new BadRequestException('Incorrect OTP');
    }

    const userDetails = await this.userRepository.getById(userId);

    if (!userDetails) {
      throw new BadRequestException('User not found.');
    }

    if (purpose === VerificationTypeEnum.EMAIL_VERIFY) {
      if (userDetails.emailVerified) {
        throw new ConflictException('Email already verified. Please login.');
      }
      await this.userRepository.updateById({ emailVerified: true }, userId);
      return this.login(req, userDetails);
    } else if (purpose === VerificationTypeEnum.FORGOT_PASSWORD) {
      const algorithm = this.configService.get<string>('CRYPTO_ALGORITHM');
      const key = Buffer.from(this.configService.get<string>('CRYPTO_AES_KEY'), 'hex');
      const iv = Buffer.from(this.configService.get<string>('CRYPTO_AES_IV'), 'hex');
      const cipher = createCipheriv(algorithm, key, iv);

      const payload = JSON.stringify({
        id: userDetails._id,
        exp: Date.now() + 15 * 60 * 1000,
      });

      let encrypted = cipher.update(payload, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      const resetPasswordToken = encrypted;

      await this.userRepository.updateById({ resetPasswordToken }, userDetails._id);

      return successResponse(
        {
          success: true,
          user: userDetails.toJSON(),
          resetPasswordToken: resetPasswordToken,
        },
        'OTP verified successfully.',
      );
    } else if (purpose === VerificationTypeEnum.LOGIN_VERIFY || purpose === VerificationTypeEnum.PHONE_VERIFY) {
      if (!userDetails.phoneVerified) {
        await this.userRepository.updateById({ phoneVerified: true }, userId);
      }
      // Call login function
      return this.login(req, userDetails);
    }

    throw new BadRequestException('Invalid request parameters.');
  }

  public async onboarding(
    userId: string,
    dto: UserOnboardingDto,
    files: {
      mainPhoto?: MulterS3File[];
      galleryPhotos?: MulterS3File[];
    },
  ): Promise<ApiResponse> {
    console.log('PAYLOAD=====>', userId, dto, files);

    const user = await this.userRepository.getById(new Types.ObjectId(userId));
    if (!user?._id) {
      throw new BadRequestException(Messages.USER_MISSING_ERROR);
    }

    let mainPhoto: string | undefined;
    let galleryPhotos: string[] = [];

    if (files?.mainPhoto?.length) {
      mainPhoto = files.mainPhoto[0].filename;
    }

    if (files?.galleryPhotos?.length) {
      galleryPhotos = files.galleryPhotos.map((file) => file.filename);
    }

    const payload = {
      ...dto,
      profileImage: mainPhoto,
      galleryPhotos,
      isOnboarded: true,
    };

    const updatedUser = await this.userRepository.updateById(payload, user._id);

    if (!updatedUser) {
      throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);
    }

    return successResponse(updatedUser, 'Onboarded successfully.');
  }

  public async faceVerification(userId: string, dto: FaceVerificationDto, file: MulterS3File): Promise<ApiResponse> {
    console.log('FACE VERIFICATION PAYLOAD=====>', userId, dto, file);

    const user = await this.userRepository.getById(new Types.ObjectId(userId));
    if (!user?._id) {
      throw new BadRequestException(Messages.USER_MISSING_ERROR);
    }

    // check file is exists
    if (!file) {
      throw new BadRequestException('Face image is required for verification.');
    }

    dto.faceImage = file.filename;

    // Placeholder for actual face verification logic
    const isVerified = true; // Assume verification is successful for demo

    if (!isVerified) {
      throw new BadRequestException('Face verification failed.');
    }

    const updatedUser = await this.userRepository.updateById(
      {
        faceVerified: true,
        faceVerificationImage: dto.faceImage,
      },
      user._id,
    );

    if (!updatedUser) {
      throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);
    }

    return successResponse(updatedUser, 'Face verified successfully.');
  }

  public async deleteAccount(userId: string): Promise<ApiResponse> {
    const user = await this.userRepository.getById(new Types.ObjectId(userId));
    if (!user?._id) {
      throw new BadRequestException(Messages.USER_MISSING_ERROR);
    }

    // Soft delete the user account
    await this.userRepository.updateById({ isDeleted: true, status: 'Inactive' }, user._id);

    // Invalidate all active sessions/devices
    await this.userDeviceRepository.updateAllByParams({ isLoggedOut: true }, { user_id: user._id });

    return successResponse({}, 'Account deleted and logged out from all devices successfully.');
  }

  public async logout(userId: string, accessToken: string): Promise<ApiResponse> {
    try {
      const tokenData = await this.userDeviceRepository.getByField({ user_id: new Types.ObjectId(userId), accessToken: accessToken });
      if (tokenData?._id) {
        await this.userDeviceRepository.updateById({ isLoggedOut: true }, tokenData._id);
      }
      return successResponse({}, Messages.USER_LOGOUT_SUCCESS);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);
    }
  }
}
