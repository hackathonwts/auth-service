import { Body, Controller, Post, UseGuards, Get, Param, Delete, Version, HttpCode, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MongoIdPipe } from '@common/pipes/mongoid.pipe';
import { Roles } from '@common/decorator/role.decorator';
import { UserRole } from '@common/enum/user-role.enum';
import { RBAcGuard } from '@common/guards/rbac.guard';
import { FilterNotificationDto, CreateNotificationDto } from '../notification.dto';
import { uploadAnyFilesInterceptor } from '@common/interceptors/files.interceptor';
import { MulterS3File } from '@common/types/multer-s3-file';
import { NotificationService } from '../notification.service';

@ApiTags('Admin Notifications Management')
@Controller('admin/notifications')
export class AdminNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ------------------------------
  // Get All Notifications (Paginated)
  // ------------------------------
  @Version('1')
  @Get()
  @Roles(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications' })
  @HttpCode(200)
  async getNotifications(@Param() params: FilterNotificationDto) {
    return this.notificationService.getNotifications(params);
  }

  // ------------------------------
  // Get Notification by ID
  // ------------------------------
  @Version('1')
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notification details by ID' })
  @HttpCode(200)
  async getNotification(@Param('id', new MongoIdPipe()) id: string) {
    return this.notificationService.getNotification(id);
  }

  // ------------------------------
  // Create a new Notification
  // ------------------------------
  @Version('1')
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadAnyFilesInterceptor({ directory: 'notifications', storage: 'local' }))
  @HttpCode(201)
  async createNotification(@Body() dto: CreateNotificationDto, @UploadedFiles() files: Record<string, MulterS3File[]>) {
    return this.notificationService.createNotification(dto, files);
  }

  // ------------------------------
  // Soft Delete Notification
  // ------------------------------
  @Version('1')
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete notification by ID' })
  @HttpCode(200)
  async deleteNotification(@Param('id', new MongoIdPipe()) id: string) {
    return this.notificationService.deleteNotification(id);
  }
}
