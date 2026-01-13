import { Body, Controller, Get, HttpCode, Patch, UploadedFiles, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user.service';
import { Roles } from '@common/decorator/role.decorator';
import { UserRole } from '@common/enum/user-role.enum';
import { RBAcGuard } from '@common/guards/rbac.guard';
import { LoginUser } from '@common/decorator/login-user.decorator';
import { uploadAnyFilesInterceptor, uploadSingleFileInterceptor } from '@common/interceptors/files.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument } from '../user.schema';
import { ChangePasswordDto, UpdateSettingsDto, UpdateUserProfileDto } from '@modules/auth/dto/auth.dto';
import { MulterS3File } from '@common/types/multer-s3-file';

@ApiTags('Profile')
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Patch('update-profile')
  @Roles(UserRole.USER)
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadSingleFileInterceptor({ directory: 'users', fieldName: 'profileImage' }))
  async updateProfile(@LoginUser() user: Partial<UserDocument>, @Body() dto: UpdateUserProfileDto, @UploadedFiles() files: MulterS3File[]) {
    return this.userService.updateProfile(user._id.toString(), dto, files);
  }

  @Version('1')
  @Patch('update-settings')
  @Roles(UserRole.USER)
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiConsumes('application/json')
  async updateSettings(@LoginUser() user: Partial<UserDocument>, @Body() dto: UpdateSettingsDto) {
    return this.userService.updateSettings(user._id.toString(), dto);
  }

  @Version('1')
  @Patch('change-password')
  @Roles(UserRole.USER)
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  async changePassword(@LoginUser() user: Partial<UserDocument>, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(user._id.toString(), dto);
  }

  // get all gallery images of user
  @Version('1')
  @Get('gallery-images')
  @Roles(UserRole.USER)
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  async getGalleryImages(@LoginUser() user: Partial<UserDocument>) {
    return this.userService.getGalleryImages(user._id.toString());
  }

  // delete gallery image by id
  @Version('1')
  @Patch('delete-gallery-image/:imageId')
  @Roles(UserRole.USER)
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  async deleteGalleryImage(@LoginUser() user: Partial<UserDocument>, @Body('imageId') imageId: string) {
    return this.userService.deleteGalleryImage(user._id.toString(), imageId);
  }

  // add gallery images
  @Version('1')
  @Patch('add-gallery-images')
  @Roles(UserRole.USER)
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadAnyFilesInterceptor({ directory: 'gallery' }))
  async addGalleryImages(@LoginUser() user: Partial<UserDocument>, @UploadedFiles() files: MulterS3File[]) {
    return this.userService.addGalleryImages(user._id.toString(), files);
  }
}
