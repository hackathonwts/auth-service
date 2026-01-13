import { Body, Controller, Delete, Get, HttpCode, Post, Req, UploadedFiles, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { uploadMultiFileInterceptor, uploadSingleFileInterceptor } from '@common/interceptors/files.interceptor';
import { Request } from 'express';
import { LoginUser } from '@common/decorator/login-user.decorator';
import { UserDocument } from '@modules/user/user.schema';
import { AuthService } from '../auth.service';
import {
  AppleSocialAuthDto,
  FacebookSocialAuthDto,
  ForgotPasswordDto,
  GoogleSocialAuthDto,
  RefreshJwtDto,
  ResendOTPDto,
  ResetPasswordDto,
  SignupDto,
  UserOnboardingDto,
  VerifyOTPDto,
} from '../dto/auth.dto';
import { MulterS3File } from '@common/types/multer-s3-file';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  // @Version('1')
  // @Post('login')
  // @HttpCode(200)
  // @UseGuards(ThrottlerGuard)
  // async login(@Body() dto: UserPhoneLoginDto) {
  //   // return this.authService.userLoginWithPhone(dto);
  // }

  @Version('1')
  @Post('register')
  @UseGuards(ThrottlerGuard)
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(uploadSingleFileInterceptor({ directory: 'users', fieldName: 'profileImage' }))
  @HttpCode(201)
  async signup(@Req() req: Request, @Body() dto: SignupDto, @UploadedFiles() files: MulterS3File[]) {
    return this.authService.userSignup(dto, files, req);
  }

  @Version('1')
  @Post('resend-otp')
  @UseGuards(ThrottlerGuard)
  @ApiConsumes('application/json')
  async resendOtp(@Body() dto: ResendOTPDto) {
    return this.authService.resendOtp(dto);
  }

  @Version('1')
  @Post('verify-otp')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  async verifyEmail(@Req() req: Request, @Body() dto: VerifyOTPDto) {
    return this.authService.verifyOtp(dto, req);
  }

  // social auth using facebook,google,apple
  @Version('1')
  @Post('google-social-auth')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  async googleSocialAuth(@Body() dto: GoogleSocialAuthDto, @Req() req: Request) {
    return this.authService.socialLoginGoogle(req, dto.idToken);
  }

  @Version('1')
  @Post('facebook-social-auth')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  async facebookSocialAuth(@Body() dto: FacebookSocialAuthDto, @Req() req: Request) {
    return this.authService.socialLoginFacebook(req, dto.accessToken);
  }

  @Version('1')
  @Post('apple-social-auth')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  async appleSocialAuth(@Body() dto: AppleSocialAuthDto, @Req() req: Request) {
    return this.authService.socialLoginApple(req, dto);
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
  @Post('onboarding')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(200)
  @UseInterceptors(
    uploadMultiFileInterceptor({
      fileFields: [
        { name: 'mainPhoto', directory: 'users', maxCount: 1 },
        { name: 'galleryPhotos', directory: 'gallery', maxCount: 5 },
      ],
    }),
  )
  async onboarding(
    @LoginUser() user: Partial<UserDocument>,
    @Body() dto: UserOnboardingDto,
    @UploadedFiles()
    files: {
      mainPhoto?: MulterS3File[];
      galleryPhotos?: MulterS3File[];
    },
  ) {
    return this.authService.onboarding(user._id.toString(), dto, files);
  }


  @Version('1')
  @Delete('delete-account')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async deleteAccount(@LoginUser() user: Partial<UserDocument>) {
    return this.authService.deleteAccount(user._id.toString());
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
