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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const role_repository_1 = require("../role/repositories/role.repository");
const user_repository_1 = require("./user.repository");
const messages_1 = require("../../common/constants/messages");
const user_device_repository_1 = require("../user-devices/repository/user-device.repository");
const user_role_enum_1 = require("../../common/enum/user-role.enum");
const status_enum_1 = require("../../common/enum/status.enum");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const response_helper_1 = require("../../helpers/response.helper");
const media_repository_1 = require("../media/media.repository");
let UserService = class UserService {
    constructor(mailQueue, mediaRepository, userRepository, userDeviceRepository, roleRepository, configService) {
        this.mailQueue = mailQueue;
        this.mediaRepository = mediaRepository;
        this.userRepository = userRepository;
        this.userDeviceRepository = userDeviceRepository;
        this.roleRepository = roleRepository;
        this.configService = configService;
    }
    async getUsers(body) {
        const getAllUsers = await this.userRepository.getAllPaginate(body);
        return (0, response_helper_1.successResponse)(getAllUsers, messages_1.Messages.USER_LISTING_SUCCESS);
    }
    async getUser(id) {
        const user = await this.userRepository.getByFieldWithProjection({ _id: new mongoose_1.Types.ObjectId(id), isDeleted: false }, {
            userName: 1,
            fullName: 1,
            email: 1,
            profileImage: 1,
            role: 1,
        });
        if (!user)
            throw new common_1.NotFoundException(messages_1.Messages.USER_MISSING_ERROR);
        return (0, response_helper_1.successResponse)(user, messages_1.Messages.USER_DATA_FETCH_SUCCESS);
    }
    async createUser(body, files) {
        const { role = user_role_enum_1.UserRole.USER, password } = body;
        const userRole = await this.roleRepository.getByField({ role: role, isDeleted: false });
        if (!userRole?._id)
            throw new common_1.BadRequestException('User role not found!');
        if (userRole.role === user_role_enum_1.UserRole.ADMINISTRATOR)
            throw new common_1.BadRequestException('Assigning an administrator role is not allowed!');
        body.role = userRole._id.toString();
        const isEmailExists = await this.userRepository.getByField({ email: { $regex: '^' + body.email + '$', $options: 'i' }, isDeleted: false });
        if (isEmailExists?._id)
            throw new common_1.ConflictException('User with this email already exists!');
        if (!password) {
            body.password = 'Password@123';
        }
        if (files?.length) {
            body.profileImage = files[0].filename;
        }
        const saveUser = await this.userRepository.save(body);
        if (!saveUser) {
            throw new common_1.BadRequestException('Failed to add user!');
        }
        return (0, response_helper_1.successResponse)(saveUser, messages_1.Messages.USER_ADD_SUCCESS);
    }
    async updateUser(id, body, files) {
        const isUserExists = await this.userRepository.getByField({ isDeleted: false, _id: new mongoose_1.Types.ObjectId(id) });
        if (!isUserExists)
            throw new common_1.NotFoundException('User not found!');
        const checkUserRole = await this.roleRepository.getByField({ _id: isUserExists.role, isDeleted: false });
        if (checkUserRole?._id && checkUserRole.role == 'admin')
            throw new common_1.BadRequestException('Modifying a user with an admin role is restricted!');
        if (body.email) {
            const isEmailExists = await this.userRepository.getByField({ email: body.email, isDeleted: false, _id: { $ne: isUserExists._id } });
            if (isEmailExists?._id)
                throw new common_1.ConflictException('User with this email already exists!');
        }
        if (body.userName) {
            const isUserNameExists = await this.userRepository.getByField({ userName: body.userName, isDeleted: false, _id: { $ne: isUserExists._id } });
            if (isUserNameExists?._id)
                throw new common_1.ConflictException('User with this user name already exists!');
        }
        if (body.role) {
            const userRole = await this.roleRepository.getByField({ _id: new mongoose_1.Types.ObjectId(body.role), isDeleted: false });
            if (!userRole?._id)
                throw new common_1.BadRequestException('User role not found!');
            if (userRole.role === 'admin')
                throw new common_1.BadRequestException('Assigning an admin role is not allowed!');
        }
        const updatedValue = {
            fullName: body.fullName ?? isUserExists.fullName,
            email: body.email ?? isUserExists.email,
            role: body.role ?? isUserExists.role,
            userName: body.userName ?? isUserExists.userName,
        };
        if (files?.length) {
            updatedValue['profileImage'] = files[0].filename;
        }
        const updateUser = await this.userRepository.updateById(updatedValue, isUserExists._id);
        if (!updateUser) {
            throw new common_1.BadRequestException(updateUser);
        }
        return (0, response_helper_1.successResponse)(updateUser, messages_1.Messages.USER_UPDATE_SUCCESS);
    }
    async updateStatus(id, body) {
        const isUserExists = await this.userRepository.getByField({
            isDeleted: false,
            _id: new mongoose_1.Types.ObjectId(id),
        });
        if (!isUserExists)
            throw new common_1.NotFoundException('User not found!');
        const checkUserRole = await this.roleRepository.getByField({
            _id: isUserExists.role,
            isDeleted: false,
        });
        if (checkUserRole?.role === user_role_enum_1.UserRole.ADMINISTRATOR)
            throw new common_1.BadRequestException('Modifying admin user is restricted!');
        const updateStatus = await this.userRepository.updateById({ status: body.status }, new mongoose_1.Types.ObjectId(id));
        if (!updateStatus)
            throw new common_1.BadRequestException('Failed to update status');
        if (updateStatus.status !== status_enum_1.StatusEnum.Active) {
            await this.userDeviceRepository.updateAllByParams({ isLoggedOut: true }, { user_id: updateStatus._id });
            const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_ADDRESS')}>`;
            const locals = {
                name: isUserExists.fullName,
                status: updateStatus.status,
                project_name: this.configService.get('PROJECT_NAME'),
            };
            await this.mailQueue.add('send-email', {
                from,
                to: isUserExists.email,
                subject: 'Status updated',
                template: 'user-status',
                locals,
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
            });
        }
        return (0, response_helper_1.successResponse)(updateStatus, messages_1.Messages.USER_STATUS_UPDATE_SUCCESS);
    }
    async resetPassword(id, body) {
        const isUserExists = await this.userRepository.getByFieldWithProjection({ isDeleted: false, _id: new mongoose_1.Types.ObjectId(id) }, { password: 1 });
        if (!isUserExists)
            throw new common_1.NotFoundException('User not found!');
        const checkUserRole = await this.roleRepository.getByField({ _id: isUserExists.role, isDeleted: false });
        if (checkUserRole?._id && checkUserRole.role == 'admin')
            throw new common_1.BadRequestException('Modifying a user with an admin role is restricted!');
        const userUpdate = await this.userRepository.updateById({ password: body.password }, new mongoose_1.Types.ObjectId(id));
        if (!userUpdate) {
            throw new common_1.BadRequestException(userUpdate);
        }
        return (0, response_helper_1.successResponse)(userUpdate, messages_1.Messages.USER_PASSWORD_RESET_SUCCESS);
    }
    async deleteUser(id) {
        const isUserExists = await this.userRepository.getByField({ isDeleted: false, _id: new mongoose_1.Types.ObjectId(id) });
        if (!isUserExists)
            throw new common_1.NotFoundException('User not found!');
        const checkUserRole = await this.roleRepository.getByField({ _id: isUserExists.role, isDeleted: false });
        if (checkUserRole?._id && checkUserRole.role == 'admin')
            throw new common_1.BadRequestException('Modifying a user with an admin role is restricted!');
        const deleteData = await this.userRepository.updateById({ isDeleted: true }, id);
        if (!deleteData) {
            throw new common_1.BadRequestException(deleteData);
        }
        return (0, response_helper_1.successResponse)(deleteData, messages_1.Messages.USER_DELETE_SUCCESS);
    }
    async deleteUsers(userIds) {
        for (const id of userIds) {
            const isUserExists = await this.userRepository.getByField({ isDeleted: false, _id: new mongoose_1.Types.ObjectId(id) });
            if (!isUserExists)
                throw new common_1.NotFoundException(`User not found for ID: ${id}`);
            const checkUserRole = await this.roleRepository.getByField({ _id: isUserExists.role, isDeleted: false });
            if (checkUserRole?._id && checkUserRole.role == 'admin')
                throw new common_1.BadRequestException(`Modifying a user with an admin role is restricted for ID: ${id}`);
        }
        const deleteData = await this.userRepository.bulkDeleteSoft(userIds);
        if (!deleteData) {
            throw new common_1.BadRequestException(deleteData);
        }
        return { success: true, message: 'User deleted successfully.' };
    }
    async updateProfile(userId, body, files) {
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
    async updateSettings(userId, body) {
        console.log('Payload', userId, body);
        return (0, response_helper_1.successResponse)({}, 'Settings updated successfully.');
    }
    async changePassword(userId, body) {
        const userData = await this.userRepository.getById(userId);
        if (!userData)
            throw new common_1.BadRequestException('User not found!');
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
        return (0, response_helper_1.successResponse)(userUpdate, 'Password updated successfully.');
    }
    async getGalleryImages(userId) {
        console.log('Payload', userId);
        const user = await this.userRepository.getById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found!');
        const galleryImages = await this.mediaRepository.getAllByField({ userId: userId, type: 'gallery' });
        return (0, response_helper_1.successResponse)(galleryImages, 'Gallery images fetched successfully.');
    }
    async deleteGalleryImage(userId, imageId) {
        console.log('Payload', userId, imageId);
        const user = await this.userRepository.getById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found!');
        await user.save();
        return (0, response_helper_1.successResponse)({}, 'Image delete successfully.');
    }
    async addGalleryImages(userId, files) {
        console.log('Payload', userId, files);
        const user = await this.userRepository.getById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found!');
        await user.save();
        return (0, response_helper_1.successResponse)({}, 'Gallery images added successfully.');
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('mail-queue')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        media_repository_1.MediaRepository,
        user_repository_1.UserRepository,
        user_device_repository_1.UserDeviceRepository,
        role_repository_1.RoleRepository,
        config_1.ConfigService])
], UserService);
