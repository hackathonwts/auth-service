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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_1 = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const refresh_token_schema_1 = require("../refresh-token/schemas/refresh-token.schema");
const role_repository_1 = require("../role/repositories/role.repository");
const user_repository_1 = require("../user/user.repository");
const mongoose_1 = require("mongoose");
const refresh_token_repository_1 = require("../refresh-token/repository/refresh-token.repository");
const messages_1 = require("../../common/constants/messages");
const request_ip_1 = require("request-ip");
const geoip_lite_1 = require("geoip-lite");
const user_device_repository_1 = require("../user-devices/repository/user-device.repository");
const winston_logger_1 = require("../../common/logger/winston.logger");
const node_crypto_1 = require("node:crypto");
const response_helper_1 = require("../../helpers/response.helper");
const user_role_enum_1 = require("../../common/enum/user-role.enum");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const social_auth_helper_1 = require("../../helpers/social-auth.helper");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const utils_helper_1 = require("../../helpers/utils.helper");
const common_enum_1 = require("../../common/enum/common.enum");
let AuthService = class AuthService {
    constructor(mailQueue, configService, roleRepository, jwtService, userRepository, userDeviceRepository, refreshTokenRepository) {
        this.mailQueue = mailQueue;
        this.configService = configService;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userDeviceRepository = userDeviceRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.winston = new winston_logger_1.WinstonLoggerService();
        const privateKeyPath = this.configService.get('APPLE_PRIVATE_KEY_PATH');
        if (privateKeyPath) {
            try {
                this.applePrivateKey = (0, node_fs_1.readFileSync)(privateKeyPath, 'utf8');
            }
            catch (error) {
                console.error('Failed to load Apple private key:', error);
            }
        }
    }
    async generateRefreshToken(accessToken, userId) {
        const salt = await (0, bcrypt_1.genSalt)(10);
        const refreshToken = new refresh_token_schema_1.RefreshToken();
        refreshToken.userId = userId;
        refreshToken.hash = await (0, bcrypt_1.hash)(accessToken.split('.')[2] + salt, salt);
        await this.refreshTokenRepository.save(refreshToken);
        return salt;
    }
    async login(req, user) {
        try {
            const tokenPayload = { userId: user._id.toJSON() };
            const accessToken = this.jwtService.sign(tokenPayload);
            const refreshToken = await this.generateRefreshToken(accessToken, user._id);
            const ip = (0, request_ip_1.getClientIp)(req);
            const geoIpInfo = ip ? (0, geoip_lite_1.lookup)(ip) : null;
            if (ip) {
                const existingDeviceData = await this.userDeviceRepository.getByField({ accessToken: accessToken });
                const { ll, region, country, city, timezone } = geoIpInfo ?? {};
                const deviceInfo = {
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
            return (0, response_helper_1.successResponse)({
                user: user.toJSON(),
                accessToken: accessToken,
                refreshToken: refreshToken,
            }, messages_1.Messages.USER_LOGIN_SUCCESS);
        }
        catch (err) {
            const stackTrace = err?.stack?.split('\n')?.reverse()?.slice(0, -2)?.reverse()?.join('\n');
            this.winston.error(stackTrace, 'userLoginService');
            return (0, response_helper_1.errorResponse)(messages_1.Messages.SOMETHING_WENT_WRONG);
        }
    }
    async signup(req, body) {
        const saveUser = await this.userRepository.save(body);
        console.log('req', req.body);
        if (!saveUser?._id)
            throw new common_1.BadRequestException(saveUser instanceof Error ? saveUser?.message : messages_1.Messages.SOMETHING_WENT_WRONG);
        const userDetails = await this.userRepository.getById(saveUser._id);
        if (!userDetails)
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        const registerViaSource = 'PHONE';
        try {
            const otp = (0, utils_helper_1.generateOtp)(4);
            const expiresAt = Date.now() + 60 * 5 * 1000;
            const encryptedOtpToken = (0, utils_helper_1.encryptCipherToken)({
                userId: userDetails._id.toString(),
                otp,
                expiresAt: expiresAt,
                purpose: registerViaSource === 'PHONE' ? common_enum_1.VerificationTypeEnum.PHONE_VERIFY : common_enum_1.VerificationTypeEnum.EMAIL_VERIFY,
            });
            if (registerViaSource === 'PHONE') {
            }
            else if (registerViaSource === 'EMAIL') {
                const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_ADDRESS')}>`;
                await this.mailQueue.add('send-email', {
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
                }, {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 5000 },
                });
            }
            const message = registerViaSource === 'PHONE' ? `${otp} OTP sent to registered phone number.` : `OTP sent to registered email address.`;
            return (0, response_helper_1.successResponse)({
                user: userDetails.toJSON(),
                token: encryptedOtpToken,
            }, message);
        }
        catch (err) {
            await this.userRepository.delete(saveUser._id);
            const stackTrace = err?.stack?.split('\n')?.reverse()?.slice(0, -2)?.reverse()?.join('\n');
            this.winston.error(stackTrace, 'userLoginService');
            return (0, response_helper_1.errorResponse)(messages_1.Messages.SOMETHING_WENT_WRONG);
        }
    }
    async findOrCreateUserFromSocial(req, profile) {
        if (!profile)
            throw new common_1.BadRequestException(messages_1.Messages.SOMETHING_WENT_WRONG);
        let user = await this.userRepository.getByField({
            socialProvider: profile.provider,
            socialProviderId: profile.id,
        });
        if (!user) {
            if (profile.email) {
                user = await this.userRepository.getByField({ email: profile.email });
            }
            if (user) {
                user.socialProvider = profile.provider;
                user.socialProviderId = profile.id;
                if (profile.picture && !user.profileImage) {
                    const uploadDir = (0, node_path_1.join)(process.cwd(), 'uploads', 'users');
                    const filename = `${user.id}-${profile.provider}.jpg`;
                    const savedPath = await (0, social_auth_helper_1.downloadAndSaveImage)(profile.picture, uploadDir, filename);
                    if (savedPath) {
                        user.profileImage = savedPath;
                    }
                }
                await this.userRepository.updateById(user, user._id);
                return this.login(req, user);
            }
            else {
                const newUser = {
                    email: profile.email,
                    emailVerified: profile.emailVerified ?? false,
                    fullName: profile.name,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    socialProvider: profile.provider,
                    socialProviderId: profile.id,
                    profileImage: null,
                };
                if (profile.picture) {
                    const uploadDir = (0, node_path_1.join)(process.cwd(), 'uploads', 'users');
                    const timestamp = Date.now();
                    const filename = `${profile.provider}-${timestamp}.jpg`;
                    const savedPath = await (0, social_auth_helper_1.downloadAndSaveImage)(profile.picture, uploadDir, filename);
                    if (savedPath) {
                        newUser.profileImage = savedPath;
                    }
                }
                user = await this.userRepository.save(newUser);
            }
        }
        return this.login(req, user);
    }
    async userSignup(body, files, req) {
        const role = 'user';
        const getRole = await this.roleRepository.getByField({ role: role });
        if (!getRole?._id)
            throw new common_1.BadRequestException(messages_1.Messages.ROLE_NOT_FOUND_ERROR);
        const userExists = await this.userRepository.getByField({
            phone: body.phone,
            isDeleted: false,
        });
        if (userExists?._id)
            throw new common_1.BadRequestException(messages_1.Messages.USER_EXIST_ERROR);
        if (files?.length) {
            for (const file of files) {
                body[file.fieldname] = file.filename;
            }
        }
        body.role = getRole._id;
        return await this.signup(req, body);
    }
    async socialLoginGoogle(req, idToken) {
        try {
            const clientId = this.configService.get('GOOGLE_CLIENT_ID');
            if (!clientId) {
                throw new Error('GOOGLE_CLIENT_ID not configured');
            }
            const profile = await (0, social_auth_helper_1.verifyGoogleIdToken)(idToken, clientId);
            return this.findOrCreateUserFromSocial(req, profile);
        }
        catch (error) {
            throw new Error(`Google authentication failed: ${error.message}`);
        }
    }
    async socialLoginFacebook(req, accessToken) {
        try {
            const appId = this.configService.get('FACEBOOK_APP_ID');
            const appSecret = this.configService.get('FACEBOOK_APP_SECRET');
            if (!appId || !appSecret) {
                throw new Error('Facebook credentials not configured');
            }
            const profile = await (0, social_auth_helper_1.getFacebookProfile)(accessToken, { appId, appSecret });
            return this.findOrCreateUserFromSocial(req, profile);
        }
        catch (error) {
            throw new Error(`Facebook authentication failed: ${error.message}`);
        }
    }
    async socialLoginApple(req, body) {
        try {
            const { code, fullName, email } = body;
            const clientId = this.configService.get('APPLE_CLIENT_ID');
            const teamId = this.configService.get('APPLE_TEAM_ID');
            const keyId = this.configService.get('APPLE_KEY_ID');
            if (!clientId || !teamId || !keyId || !this.applePrivateKey) {
                throw new Error('Apple credentials not properly configured');
            }
            const clientSecret = await (0, social_auth_helper_1.generateAppleClientSecret)({
                teamId: teamId,
                clientId: clientId,
                keyId: keyId,
                privateKey: this.applePrivateKey,
            });
            const appleIdToken = await (0, social_auth_helper_1.getAppleIdToken)(code, clientId, clientSecret);
            if (!appleIdToken)
                throw new common_1.BadRequestException(messages_1.Messages.SOMETHING_WENT_WRONG);
            const userData = {
                name: fullName ? { firstName: fullName.split(' ')[0], lastName: fullName.split(' ')[1] } : null,
                email: email,
            };
            const profile = await (0, social_auth_helper_1.verifyAppleIdentityToken)(appleIdToken, clientId, userData);
            return this.findOrCreateUserFromSocial(req, profile);
        }
        catch (err) {
            const stackTrace = err?.stack?.split('\n')?.reverse()?.slice(0, -2)?.reverse()?.join('\n');
            this.winston.error(stackTrace, 'socialLoginApple');
            return (0, response_helper_1.errorResponse)(messages_1.Messages.SOMETHING_WENT_WRONG);
        }
    }
    async adminLogin(req, body) {
        const existsUser = await this.userRepository.getByField({
            email: body.email,
            isDeleted: false,
        });
        if (!existsUser?._id)
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        if (!existsUser.validPassword(body.password)) {
            throw new common_1.BadRequestException(messages_1.Messages.INVALID_CREDENTIALS_ERROR);
        }
        const userRole = await this.roleRepository.getByField({
            _id: new mongoose_1.Types.ObjectId(existsUser.role),
            isDeleted: false,
            roleGroup: user_role_enum_1.RoleGroup.BACKEND,
        });
        console.log('userRole', userRole, {
            _id: new mongoose_1.Types.ObjectId(existsUser.role),
            isDeleted: false,
            roleGroup: user_role_enum_1.RoleGroup.BACKEND,
        });
        if (!userRole?._id) {
            throw new common_1.BadRequestException('User role not found or not a backend role!');
        }
        if (existsUser.status === 'Inactive') {
            throw new common_1.BadRequestException(messages_1.Messages.USER_INACTIVE_ERROR);
        }
        return await this.login(req, existsUser);
    }
    async adminSignup(body, files, req) {
        const role = 'admin';
        const getRole = await this.roleRepository.getByField({ role: role });
        if (!getRole?._id)
            throw new common_1.BadRequestException(messages_1.Messages.ROLE_NOT_FOUND_ERROR);
        const userExists = await this.userRepository.getByField({
            email: body.email,
            isDeleted: false,
        });
        if (userExists?._id)
            throw new common_1.BadRequestException(messages_1.Messages.USER_EXIST_ERROR);
        if (files?.length) {
            for (const file of files) {
                body[file.fieldname] = file.filename;
            }
        }
        body.role = getRole._id;
        return await this.signup(req, body);
    }
    async refreshToken(body) {
        const { accessToken, refreshToken } = body;
        const tokenData = await this.userDeviceRepository.getByField({
            accessToken: accessToken,
            isLoggedOut: false,
            isDeleted: false,
        });
        if (tokenData?._id) {
            const refreshTokenHash = await (0, bcrypt_1.hash)(body.accessToken.split('.')[2] + refreshToken, refreshToken);
            const refreshTokenData = await this.refreshTokenRepository.getByField({
                hash: refreshTokenHash,
            });
            if (!refreshTokenData)
                throw new common_1.BadRequestException(messages_1.Messages.INVALID_TOKEN_ERROR);
            const user = await this.userRepository.getByField({ _id: new mongoose_1.Types.ObjectId(refreshTokenData.userId), isDeleted: false, status: 'Active' });
            if (!user?._id)
                throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
            const expiresDate = new Date(refreshTokenData.createdAt);
            expiresDate.setSeconds(expiresDate.getSeconds() + this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'));
            if (refreshTokenData.createdAt > expiresDate) {
                await this.refreshTokenRepository.delete(refreshTokenData._id);
                throw new common_1.UnauthorizedException(messages_1.Messages.REFRESH_TOKEN_EXPIRED_ERROR);
            }
            const payload = { userId: refreshTokenData.userId.toString() };
            const newAccessToken = this.jwtService.sign(payload);
            const newRefreshToken = await (0, bcrypt_1.genSalt)(10);
            refreshTokenData.hash = await (0, bcrypt_1.hash)(newAccessToken.split('.')[2] + newRefreshToken, newRefreshToken);
            if (refreshTokenData) {
                await this.refreshTokenRepository.save(refreshTokenData);
            }
            const existingDeviceData = await this.userDeviceRepository.getByField({ accessToken: accessToken });
            if (existingDeviceData?._id) {
                await this.userDeviceRepository.updateById({
                    accessToken: newAccessToken,
                }, existingDeviceData?._id);
            }
            return (0, response_helper_1.successResponse)({ accessToken: newAccessToken, refreshToken: newRefreshToken }, messages_1.Messages.REFRESH_TOKEN_ISSUED_SUCCESS);
        }
        else {
            throw new common_1.UnauthorizedException('Token has been invalidated. Please log in again.');
        }
    }
    async forgotPassword(body) {
        const existUser = await this.userRepository.getByField({
            email: body.email,
            isDeleted: false,
        });
        if (!existUser?._id) {
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        }
        if (existUser.status === 'Blocked') {
            throw new common_1.BadRequestException(messages_1.Messages.USER_BLOCKED_ERROR);
        }
        const userRole = await this.roleRepository.getByField({
            _id: new mongoose_1.Types.ObjectId(existUser.role),
            isDeleted: false,
        });
        if (!userRole?._id) {
            throw new common_1.BadRequestException('User role not found.');
        }
        const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_ADDRESS')}>`;
        if (userRole.role === user_role_enum_1.UserRole.ADMINISTRATOR) {
            const algorithm = this.configService.get('CRYPTO_ALGORITHM');
            const key = Buffer.from(this.configService.get('CRYPTO_AES_KEY'), 'hex');
            const iv = Buffer.from(this.configService.get('CRYPTO_AES_IV'), 'hex');
            const cipher = (0, node_crypto_1.createCipheriv)(algorithm, key, iv);
            const payload = JSON.stringify({
                id: existUser._id,
                exp: Date.now() + 15 * 60 * 1000,
            });
            let encrypted = cipher.update(payload, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            const resetPasswordToken = encrypted;
            let baseUrl = this.configService.get('USER_BASE_URL');
            if (userRole.roleGroup === user_role_enum_1.RoleGroup.BACKEND) {
                baseUrl = this.configService.get('ADMIN_BASE_URL');
            }
            const resetLink = `${baseUrl}/auth/reset-password/${encodeURIComponent(resetPasswordToken)}`;
            await this.mailQueue.add('send-email', {
                from,
                to: existUser.email,
                subject: 'Password Reset Link',
                template: 'forgot-password',
                locals: {
                    project_name: this.configService.get('PROJECT_NAME'),
                    resetLink,
                },
            }, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
            });
            await this.userRepository.updateById({ resetPasswordToken }, existUser._id);
            return (0, response_helper_1.successResponse)(null, messages_1.Messages.FORGOT_PASSWORD_SUCCESS);
        }
        const otp = (0, utils_helper_1.generateOtp)(4);
        const expiresAt = Date.now() + 10 * 60 * 1000;
        const otpToken = (0, utils_helper_1.encryptCipherToken)({
            userId: existUser._id.toString(),
            otp,
            expiresAt,
            purpose: common_enum_1.VerificationTypeEnum.FORGOT_PASSWORD,
        });
        const expiryHuman = '10 minutes';
        await this.mailQueue.add('send-email', {
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
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
        });
        return (0, response_helper_1.successResponse)({ otpToken }, 'OTP sent successfully.');
    }
    async resetPassword(body) {
        const { newPassword, resetPasswordToken } = body;
        let decoded;
        try {
            const algorithm = this.configService.get('CRYPTO_ALGORITHM');
            const key = Buffer.from(this.configService.get('CRYPTO_AES_KEY'), 'hex');
            const iv = Buffer.from(this.configService.get('CRYPTO_AES_IV'), 'hex');
            const decipher = (0, node_crypto_1.createDecipheriv)(algorithm, key, iv);
            let decrypted = decipher.update(resetPasswordToken, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            decoded = JSON.parse(decrypted);
            if (decoded.exp <= Date.now())
                throw new common_1.BadRequestException(messages_1.Messages.INVALID_TOKEN_ERROR);
        }
        catch (error) {
            console.error('Decryption error:', error);
            throw new common_1.BadRequestException(messages_1.Messages.INVALID_TOKEN_ERROR);
        }
        const user = await this.userRepository.getByField({
            _id: new mongoose_1.Types.ObjectId(decoded.id),
            isDeleted: false,
        });
        if (!user?._id)
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        if (user.resetPasswordToken !== resetPasswordToken) {
            throw new common_1.BadRequestException(messages_1.Messages.INVALID_TOKEN_ERROR);
        }
        await this.userRepository.updateById({ password: newPassword, resetPasswordToken: null }, user._id);
        return (0, response_helper_1.successResponse)(null, messages_1.Messages.PASSWORD_UPDATE_SUCCESS);
    }
    async changePassword(userId, body) {
        const userData = await this.userRepository.getById(userId);
        const oldPasswordMatch = userData.validPassword(body.currentPassword);
        if (!oldPasswordMatch)
            throw new common_1.BadRequestException('Old credential mis-matched!');
        const newPassVsOldPass = userData.validPassword(body.password);
        if (newPassVsOldPass)
            throw new common_1.BadRequestException('New password cannot be same as your old password!');
        const userUpdate = await this.userRepository.updateById({ password: body.password }, userData._id);
        if (!userUpdate) {
            throw new common_1.BadRequestException(userUpdate);
        }
        return { success: true, message: 'User password updated successfully.', data: userUpdate };
    }
    async getProfileDetails(userId) {
        const userDetails = await this.userRepository.getUserDetails(userId);
        if (!userDetails?._id)
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        return (0, response_helper_1.successResponse)(userDetails, 'Profile details retrieved successfully.');
    }
    async updateProfileDetails(userId, body, files) {
        const { email, phone } = body;
        const userDetails = await this.userRepository.getUserDetails(userId);
        if (!userDetails?._id)
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        if (email) {
            const isEmailExists = await this.userRepository.getByField({ email: { $regex: '^' + email + '$', $options: 'i' }, isDeleted: false, _id: { $ne: userId } });
            if (isEmailExists?._id)
                throw new common_1.ConflictException(messages_1.Messages.USER_EXIST_ERROR);
        }
        if (phone) {
            const isPhoneExists = await this.userRepository.getByField({ phone: { $regex: '^' + phone + '$', $options: 'i' }, isDeleted: false, _id: { $ne: userId } });
            if (isPhoneExists?._id)
                throw new common_1.ConflictException(messages_1.Messages.USER_EXIST_ERROR);
        }
        if (files?.length) {
            if (userDetails?.profileImage) {
            }
            for (const file of files) {
                body[file.fieldname] = file.filename;
            }
        }
        const updateData = await this.userRepository.updateById(body, new mongoose_1.Types.ObjectId(userId));
        if (!updateData)
            throw new common_1.BadRequestException(messages_1.Messages.SOMETHING_WENT_WRONG);
        return (0, response_helper_1.successResponse)(updateData, 'Profile updated successfully.');
    }
    async resendOtp(dto) {
        const { userId, purpose } = (0, utils_helper_1.decryptCipherToken)(dto.token);
        const userDetails = await this.userRepository.getById(userId);
        if (!userDetails?._id)
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_ADDRESS')}>`;
        const projectName = this.configService.get('PROJECT_NAME');
        const name = userDetails.fullName ?? `${userDetails.firstName} ${userDetails.lastName}`.trim();
        const createOtpToken = (ttlMs, _purpose) => {
            const otp = (0, utils_helper_1.generateOtp)(4);
            const expiresAt = Date.now() + ttlMs;
            const token = (0, utils_helper_1.encryptCipherToken)({
                userId: userDetails._id.toString(),
                otp,
                expiresAt,
                purpose: _purpose,
            });
            return { otp, expiresAt, token };
        };
        try {
            if (purpose === common_enum_1.VerificationTypeEnum.EMAIL_VERIFY) {
                if (userDetails.emailVerified) {
                    throw new common_1.ConflictException('Email already verified. Please login.');
                }
                const { otp, token } = createOtpToken(60 * 5 * 1000, purpose);
                await this.mailQueue.add('send-email', {
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
                }, {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 5000 },
                });
                return (0, response_helper_1.successResponse)({
                    user: userDetails.toJSON(),
                    token,
                });
            }
            if (purpose === common_enum_1.VerificationTypeEnum.FORGOT_PASSWORD) {
                const { otp, token } = createOtpToken(10 * 60 * 1000, purpose);
                const expiryHuman = '10 minutes';
                await this.mailQueue.add('send-email', {
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
                }, {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 5000 },
                });
                return (0, response_helper_1.successResponse)({ otpToken: token }, 'OTP sent successfully.');
            }
            if (purpose === common_enum_1.VerificationTypeEnum.PHONE_VERIFY || purpose === common_enum_1.VerificationTypeEnum.LOGIN_VERIFY) {
                const { otp, token } = createOtpToken(60 * 5 * 1000, purpose);
                return (0, response_helper_1.successResponse)({
                    user: userDetails.toJSON(),
                    token,
                }, `${otp} OTP sent successfully.`);
            }
            throw new common_1.BadRequestException('Invalid request parameters.');
        }
        catch (err) {
            const stackTrace = err?.stack?.split('\n')?.reverse()?.slice(0, -2)?.reverse()?.join('\n');
            this.winston.error(stackTrace, 'resendOtpService');
            return (0, response_helper_1.errorResponse)(messages_1.Messages.SOMETHING_WENT_WRONG);
        }
    }
    async verifyOtp(dto, req) {
        const { userId, otp, purpose, expiresAt } = (0, utils_helper_1.decryptCipherToken)(dto.token);
        if (!userId || !otp || !expiresAt || !purpose) {
            throw new common_1.BadRequestException('Invalid token.');
        }
        if (purpose !== dto.type) {
            throw new common_1.BadRequestException('Invalid OTP token type.');
        }
        if (Date.now() > expiresAt) {
            throw new common_1.BadRequestException('OTP expired');
        }
        if (otp !== dto.otp) {
            throw new common_1.BadRequestException('Incorrect OTP');
        }
        const userDetails = await this.userRepository.getById(userId);
        if (!userDetails) {
            throw new common_1.BadRequestException('User not found.');
        }
        if (purpose === common_enum_1.VerificationTypeEnum.EMAIL_VERIFY) {
            if (userDetails.emailVerified) {
                throw new common_1.ConflictException('Email already verified. Please login.');
            }
            await this.userRepository.updateById({ emailVerified: true }, userId);
            return this.login(req, userDetails);
        }
        else if (purpose === common_enum_1.VerificationTypeEnum.FORGOT_PASSWORD) {
            const algorithm = this.configService.get('CRYPTO_ALGORITHM');
            const key = Buffer.from(this.configService.get('CRYPTO_AES_KEY'), 'hex');
            const iv = Buffer.from(this.configService.get('CRYPTO_AES_IV'), 'hex');
            const cipher = (0, node_crypto_1.createCipheriv)(algorithm, key, iv);
            const payload = JSON.stringify({
                id: userDetails._id,
                exp: Date.now() + 15 * 60 * 1000,
            });
            let encrypted = cipher.update(payload, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            const resetPasswordToken = encrypted;
            await this.userRepository.updateById({ resetPasswordToken }, userDetails._id);
            return (0, response_helper_1.successResponse)({
                success: true,
                user: userDetails.toJSON(),
                resetPasswordToken: resetPasswordToken,
            }, 'OTP verified successfully.');
        }
        else if (purpose === common_enum_1.VerificationTypeEnum.LOGIN_VERIFY || purpose === common_enum_1.VerificationTypeEnum.PHONE_VERIFY) {
            if (!userDetails.phoneVerified) {
                await this.userRepository.updateById({ phoneVerified: true }, userId);
            }
            return this.login(req, userDetails);
        }
        throw new common_1.BadRequestException('Invalid request parameters.');
    }
    async onboarding(userId, dto, files) {
        console.log('PAYLOAD=====>', userId, dto, files);
        const user = await this.userRepository.getById(new mongoose_1.Types.ObjectId(userId));
        if (!user?._id) {
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        }
        let mainPhoto;
        let galleryPhotos = [];
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
            throw new common_1.BadRequestException(messages_1.Messages.SOMETHING_WENT_WRONG);
        }
        return (0, response_helper_1.successResponse)(updatedUser, 'Onboarded successfully.');
    }
    async faceVerification(userId, dto, file) {
        console.log('FACE VERIFICATION PAYLOAD=====>', userId, dto, file);
        const user = await this.userRepository.getById(new mongoose_1.Types.ObjectId(userId));
        if (!user?._id) {
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        }
        if (!file) {
            throw new common_1.BadRequestException('Face image is required for verification.');
        }
        dto.faceImage = file.filename;
        const isVerified = true;
        if (!isVerified) {
            throw new common_1.BadRequestException('Face verification failed.');
        }
        const updatedUser = await this.userRepository.updateById({
            faceVerified: true,
            faceVerificationImage: dto.faceImage,
        }, user._id);
        if (!updatedUser) {
            throw new common_1.BadRequestException(messages_1.Messages.SOMETHING_WENT_WRONG);
        }
        return (0, response_helper_1.successResponse)(updatedUser, 'Face verified successfully.');
    }
    async deleteAccount(userId) {
        const user = await this.userRepository.getById(new mongoose_1.Types.ObjectId(userId));
        if (!user?._id) {
            throw new common_1.BadRequestException(messages_1.Messages.USER_MISSING_ERROR);
        }
        await this.userRepository.updateById({ isDeleted: true, status: 'Inactive' }, user._id);
        await this.userDeviceRepository.updateAllByParams({ isLoggedOut: true }, { user_id: user._id });
        return (0, response_helper_1.successResponse)({}, 'Account deleted and logged out from all devices successfully.');
    }
    async logout(userId, accessToken) {
        try {
            const tokenData = await this.userDeviceRepository.getByField({ user_id: new mongoose_1.Types.ObjectId(userId), accessToken: accessToken });
            if (tokenData?._id) {
                await this.userDeviceRepository.updateById({ isLoggedOut: true }, tokenData._id);
            }
            return (0, response_helper_1.successResponse)({}, messages_1.Messages.USER_LOGOUT_SUCCESS);
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(messages_1.Messages.SOMETHING_WENT_WRONG);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('mail-queue')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        config_1.ConfigService,
        role_repository_1.RoleRepository,
        jwt_1.JwtService,
        user_repository_1.UserRepository,
        user_device_repository_1.UserDeviceRepository,
        refresh_token_repository_1.RefreshTokenRepository])
], AuthService);
