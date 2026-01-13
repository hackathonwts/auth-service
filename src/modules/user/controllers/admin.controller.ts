import { Body, Controller, Post, UseGuards, Version, UseInterceptors, UploadedFiles, Param, Get, Delete, HttpCode, Patch, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto, ListingUserDto, UpdateUserPasswordDto, UpdateUserDto, UpdateUserStatusDto } from '@modules/user/user.dto';
import { uploadSingleFileInterceptor } from '@common/interceptors/files.interceptor';
import { MongoIdPipe } from '@common/pipes/mongoid.pipe';
import { Roles } from '@common/decorator/role.decorator';
import { UserRole } from '@common/enum/user-role.enum';
import { RBAcGuard } from '@common/guards/rbac.guard';
import { UserService } from '../user.service';

@ApiTags('User Management')
@Controller('admin/user')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Post('list')
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async getUsers(@Body(new ValidationPipe({ transform: true })) dto: ListingUserDto) {
    return this.userService.getUsers(dto);
  }

  @Version('1')
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadSingleFileInterceptor({ directory: 'users', fieldName: 'profileImage' }))
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  async createUser(@Body() dto: CreateUserDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.userService.createUser(dto, files);
  }

  @Version('1')
  @Get('details/:userId')
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async getUser(@Param('userId', new MongoIdPipe()) userId: string) {
    return this.userService.getUser(userId);
  }

  @Version('1')
  @Patch('update-profile/:userId')
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth() 
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadSingleFileInterceptor({ directory: 'users', fieldName: 'profileImage' }))
  async updateUserProfile(@Param('userId', new MongoIdPipe()) userId: string, @Body(new ValidationPipe({ transform: true })) dto: UpdateUserDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.userService.updateUser(userId, dto, files);
  }

  @Version('1')
  @Patch('update-status/:userId')
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async updateUserStatus(@Param('userId', new MongoIdPipe()) userId: string, @Body() dto: UpdateUserStatusDto) {
    return this.userService.updateStatus(userId, dto);
  }

  @Version('1')
  @Patch('reset-password/:userId')
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async resetUserPassword(@Param('userId', new MongoIdPipe()) userId: string, @Body() dto: UpdateUserPasswordDto) {
    return this.userService.resetPassword(userId, dto);
  }

  @Version('1')
  @Delete('delete/:userId')
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async deleteUser(@Param('userId', new MongoIdPipe()) userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Version('1')
  @Post('delete-multiple')
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async deleteUsers(@Body() dto: { userIds: string[] }) {
    return this.userService.deleteUsers(dto.userIds);
  }
}
