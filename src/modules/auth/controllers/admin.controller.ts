import { Body, Controller, Get, HttpCode, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { uploadSingleFileInterceptor } from '@common/interceptors/files.interceptor';
import { Request } from 'express';
import { LoginUser } from '@common/decorator/login-user.decorator';
import { UserDocument } from '@modules/user/user.schema';
import { AuthService } from '../auth.service';
import { AdminLoginDto, ForgotPasswordDto, RefreshJwtDto, ResetPasswordDto, UpdateAdminProfileDto, ChangePasswordDto } from '../dto/auth.dto';
import { Roles } from '@common/decorator/role.decorator';
import { UserRole } from '@common/enum/user-role.enum'; 
import { RBAcGuard } from '@common/guards/rbac.guard';

@ApiTags('Auth')
@Controller('admin/auth')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  async login(@Req() req: Request, @Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(req, dto);
  }

  @Version('1')
  @Post('forgot-password')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Version('1')
  @Post('reset-password')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Version('1')
  @Post('refresh-token')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  async refreshToken(@Body() dto: RefreshJwtDto) {
    return this.authService.refreshToken(dto);
  }

  @Version('1')
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(200)
  async profileDetails(@LoginUser() user: Partial<UserDocument>) {
    return this.authService.getProfileDetails(user._id.toString());
  }

  @Version('1')
  @Get('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async logout(@Req() req: Request, @LoginUser() user: Partial<UserDocument>) {
    const accessToken = req.headers.authorization.split(' ')[1];
    return this.authService.logout(user._id.toString(), accessToken);
  }
}

@ApiTags('Profile')
@Controller('admin/profile')
export class AdminProfileController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Patch('update')
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadSingleFileInterceptor({ directory: 'users', fieldName: 'profileImage' }))
  @HttpCode(200)
  async updateProfile(@LoginUser() user: Partial<UserDocument>, @Body() dto: UpdateAdminProfileDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.authService.updateProfileDetails(user._id.toString(), dto, files);
  }

  @Version('1')
  @Patch('change-password')
  @Roles(UserRole.ADMIN, UserRole.ADMINISTRATOR)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async changePassword(@LoginUser() user: Partial<UserDocument>, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user._id.toString(), dto);
  }
}
