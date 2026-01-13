import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { RoleRepository } from '@modules/role/repositories/role.repository';
import { UpdateUserPasswordDto, ListingUserDto, CreateUserDto, UpdateUserStatusDto, UpdateUserDto } from './user.dto';
import type { ApiResponse } from '@common/types/api-response.type';
import { UserRepository } from './user.repository';
import { Messages } from '@common/constants/messages';
import { UserDeviceRepository } from '@modules/user-devices/repository/user-device.repository';
import { UserRole } from '@common/enum/user-role.enum';
import { StatusEnum } from '@common/enum/status.enum';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { successResponse } from '@helpers/response.helper';
import { ChangePasswordDto, UpdateUserProfileDto } from '@modules/auth/dto/auth.dto';
import { MulterS3File } from '@common/types/multer-s3-file';
import { MediaRepository } from '@modules/media/media.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectQueue('mail-queue') private readonly mailQueue: Queue,
    private readonly mediaRepository: MediaRepository,
    private readonly userRepository: UserRepository,
    private readonly userDeviceRepository: UserDeviceRepository,
    private readonly roleRepository: RoleRepository,
    private readonly configService: ConfigService,
  ) {}

  //================= For Admin Users =================//
  public async getUsers(body: ListingUserDto): Promise<ApiResponse> {
    const getAllUsers = await this.userRepository.getAllPaginate(body);
    return successResponse(getAllUsers, Messages.USER_LISTING_SUCCESS);
  }

  public async getUser(id: string): Promise<ApiResponse> {
    const user = await this.userRepository.getByFieldWithProjection(
      { _id: new Types.ObjectId(id), isDeleted: false },
      {
        userName: 1,
        fullName: 1,
        email: 1,
        profileImage: 1,
        role: 1,
      },
    );

    if (!user) throw new NotFoundException(Messages.USER_MISSING_ERROR);
    return successResponse(user, Messages.USER_DATA_FETCH_SUCCESS);
  }

  public async createUser(body: CreateUserDto, files: Express.Multer.File[]): Promise<ApiResponse> {
    const { role = UserRole.USER, password } = body;
    const userRole = await this.roleRepository.getByField({ role: role, isDeleted: false });
    if (!userRole?._id) throw new BadRequestException('User role not found!');

    if (userRole.role === UserRole.ADMINISTRATOR) throw new BadRequestException('Assigning an administrator role is not allowed!');

    body.role = userRole._id.toString();

    const isEmailExists = await this.userRepository.getByField({ email: { $regex: '^' + body.email + '$', $options: 'i' }, isDeleted: false });
    if (isEmailExists?._id) throw new ConflictException('User with this email already exists!');

    if (!password) {
      body.password = 'Password@123';
    }

    if (files?.length) {
      body.profileImage = files[0].filename;
    }

    // Save new User if the question doesn't exist
    const saveUser = await this.userRepository.save(body);
    if (!saveUser) {
      throw new BadRequestException('Failed to add user!');
    }

    return successResponse(saveUser, Messages.USER_ADD_SUCCESS);
  }

  public async updateUser(id: string, body: UpdateUserDto, files: Express.Multer.File[]): Promise<ApiResponse> {
    const isUserExists = await this.userRepository.getByField({ isDeleted: false, _id: new Types.ObjectId(id) });
    if (!isUserExists) throw new NotFoundException('User not found!');

    const checkUserRole = await this.roleRepository.getByField({ _id: isUserExists.role, isDeleted: false });

    if (checkUserRole?._id && checkUserRole.role == 'admin') throw new BadRequestException('Modifying a user with an admin role is restricted!');

    if (body.email) {
      const isEmailExists = await this.userRepository.getByField({ email: body.email, isDeleted: false, _id: { $ne: isUserExists._id } });
      if (isEmailExists?._id) throw new ConflictException('User with this email already exists!');
    }

    if (body.userName) {
      const isUserNameExists = await this.userRepository.getByField({ userName: body.userName, isDeleted: false, _id: { $ne: isUserExists._id } });
      if (isUserNameExists?._id) throw new ConflictException('User with this user name already exists!');
    }

    if (body.role) {
      const userRole = await this.roleRepository.getByField({ _id: new Types.ObjectId(body.role), isDeleted: false });
      if (!userRole?._id) throw new BadRequestException('User role not found!');

      if (userRole.role === 'admin') throw new BadRequestException('Assigning an admin role is not allowed!');
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

    // Save new User if the question doesn't exist
    const updateUser = await this.userRepository.updateById(updatedValue, isUserExists._id);
    if (!updateUser) {
      throw new BadRequestException(updateUser);
    }

    return successResponse(updateUser, Messages.USER_UPDATE_SUCCESS);
  }

  public async updateStatus(id: string, body: UpdateUserStatusDto): Promise<ApiResponse> {
    const isUserExists = await this.userRepository.getByField({
      isDeleted: false,
      _id: new Types.ObjectId(id),
    });
    if (!isUserExists) throw new NotFoundException('User not found!');

    const checkUserRole = await this.roleRepository.getByField({
      _id: isUserExists.role,
      isDeleted: false,
    });

    if (checkUserRole?.role === UserRole.ADMINISTRATOR) throw new BadRequestException('Modifying admin user is restricted!');

    const updateStatus = await this.userRepository.updateById({ status: body.status }, new Types.ObjectId(id));

    if (!updateStatus) throw new BadRequestException('Failed to update status');

    if (updateStatus.status !== StatusEnum.Active) {
      await this.userDeviceRepository.updateAllByParams({ isLoggedOut: true }, { user_id: updateStatus._id });

      const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_ADDRESS')}>`;
      const locals = {
        name: isUserExists.fullName,
        status: updateStatus.status,
        project_name: this.configService.get('PROJECT_NAME'),
      };

      // Add email job to queue
      await this.mailQueue.add(
        'send-email',
        {
          from,
          to: isUserExists.email,
          subject: 'Status updated',
          template: 'user-status',
          locals,
        },
        {
          attempts: 3, // retry 3 times
          backoff: {
            type: 'exponential',
            delay: 5000, // retry after 5s, then 10s, etc.
          },
        },
      );
    }

    return successResponse(updateStatus, Messages.USER_STATUS_UPDATE_SUCCESS);
  }

  public async resetPassword(id: string, body: UpdateUserPasswordDto): Promise<ApiResponse> {
    const isUserExists = await this.userRepository.getByFieldWithProjection({ isDeleted: false, _id: new Types.ObjectId(id) }, { password: 1 });
    if (!isUserExists) throw new NotFoundException('User not found!');

    const checkUserRole = await this.roleRepository.getByField({ _id: isUserExists.role, isDeleted: false });

    if (checkUserRole?._id && checkUserRole.role == 'admin') throw new BadRequestException('Modifying a user with an admin role is restricted!');

    const userUpdate = await this.userRepository.updateById({ password: body.password }, new Types.ObjectId(id));
    if (!userUpdate) {
      throw new BadRequestException(userUpdate);
    }

    return successResponse(userUpdate, Messages.USER_PASSWORD_RESET_SUCCESS);
  }

  public async deleteUser(id: string): Promise<ApiResponse> {
    const isUserExists = await this.userRepository.getByField({ isDeleted: false, _id: new Types.ObjectId(id) });
    if (!isUserExists) throw new NotFoundException('User not found!');

    const checkUserRole = await this.roleRepository.getByField({ _id: isUserExists.role, isDeleted: false });

    if (checkUserRole?._id && checkUserRole.role == 'admin') throw new BadRequestException('Modifying a user with an admin role is restricted!');

    const deleteData = await this.userRepository.updateById({ isDeleted: true }, id);
    if (!deleteData) {
      throw new BadRequestException(deleteData);
    }

    return successResponse(deleteData, Messages.USER_DELETE_SUCCESS);
  }

  public async deleteUsers(userIds: string[]): Promise<ApiResponse> {
    // Validate each user before deletion
    for (const id of userIds) {
      const isUserExists = await this.userRepository.getByField({ isDeleted: false, _id: new Types.ObjectId(id) });
      if (!isUserExists) throw new NotFoundException(`User not found for ID: ${id}`);

      const checkUserRole = await this.roleRepository.getByField({ _id: isUserExists.role, isDeleted: false });

      if (checkUserRole?._id && checkUserRole.role == 'admin') throw new BadRequestException(`Modifying a user with an admin role is restricted for ID: ${id}`);
    }

    // Proceed to delete users
    const deleteData = await this.userRepository.bulkDeleteSoft(userIds);
    if (!deleteData) {
      throw new BadRequestException(deleteData);
    }

    return { success: true, message: 'User deleted successfully.' };
  }

  //================= For Frontend User =================//

  public async updateProfile(userId: string, body: UpdateUserProfileDto, files: Express.Multer.File[]): Promise<ApiResponse> {
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
        //  Delete previous files for public/uploads
      }
      for (const file of files) {
        body[file.fieldname] = file.filename;
      }
    }
    const updateData = await this.userRepository.updateById(body, new Types.ObjectId(userId));
    if (!updateData) throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);
    return successResponse(updateData, 'Profile updated successfully.');
  }

  public async updateSettings(userId: string, body: any): Promise<ApiResponse> {
    console.log('Payload', userId, body);
    // Update settings logic here
    // Code here to update the settings for the user with id `userId` using the data in `body`
    return successResponse({}, 'Settings updated successfully.');
  }

  public async changePassword(userId: string, body: ChangePasswordDto): Promise<ApiResponse> {
    // Check user existence
    const userData = await this.userRepository.getById(userId);
    if (!userData) throw new BadRequestException('User not found!');

    // Check old password match
    const oldPasswordMatch = userData.validPassword(body.currentPassword);
    if (!oldPasswordMatch) throw new BadRequestException('Old credential mis-matched!');

    // Check new password match with old password
    const newPassVsOldPass = userData.validPassword(body.password);
    if (newPassVsOldPass) throw new BadRequestException('New password cannot be same as your old password!');

    // Update password
    const userUpdate = await this.userRepository.updateById({ password: body.password }, userData._id);
    if (!userUpdate) {
      throw new BadRequestException(userUpdate);
    }

    return successResponse(userUpdate, 'Password updated successfully.');
  }

  public async getGalleryImages(userId: string): Promise<ApiResponse> {
    console.log('Payload', userId);
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundException('User not found!');
    // Fetch gallery images logic here
    // const galleryImages = user.galleryPhotos; // Replace with actual fetch logic
    const galleryImages = await this.mediaRepository.getAllByField({ userId: userId, type: 'gallery' });
    return successResponse(galleryImages, 'Gallery images fetched successfully.');
  }

  public async deleteGalleryImage(userId: string, imageId: string): Promise<ApiResponse> {
    console.log('Payload', userId, imageId);
    // Delete gallery image logic here
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundException('User not found!');
    // Assuming galleryPhotos is an array of image objects with an id property
    // user.galleryPhotos = user.galleryPhotos.filter(image => image.id !== imageId);
    await user.save();
    return successResponse({}, 'Image delete successfully.');
  }

  public async addGalleryImages(userId: string, files: MulterS3File[]): Promise<ApiResponse> {
    console.log('Payload', userId, files);
    // Add gallery images logic here
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundException('User not found!');
    // Assuming galleryPhotos is an array of image objects with an id property
    // user.galleryPhotos = user.galleryPhotos.filter(image => image.id !== imageId);
    await user.save();
    return successResponse({}, 'Gallery images added successfully.');
  }
}
