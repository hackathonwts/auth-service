import { Controller, UseGuards, Get, Param, Delete, Version, HttpCode, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RBAcGuard } from '@common/guards/rbac.guard';
import { Roles } from '@common/decorator/role.decorator';
import { UserRole } from '@common/enum/user-role.enum';
import { MongoIdPipe } from '@common/pipes/mongoid.pipe';
import { NotificationService } from '../notification.service';
import { LoginUser } from '@common/decorator/login-user.decorator';
import { UserDocument } from '@modules/user/user.schema';
import { FilterNotificationDto } from '../notification.dto';

@ApiTags('Notifications')
@Controller('notification')
export class UserNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ---------------------------------------------------
  // 1) Get All Notifications of Logged-in User
  // ---------------------------------------------------
  @Version('1')
  @Get()
  @Roles(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications for the logged-in user' })
  @HttpCode(200)
  async getNotifications(@Param() params: FilterNotificationDto, @LoginUser() user: UserDocument) {
    params.userId = user._id.toString();
    return this.notificationService.getNotifications(params);
  }

  // ---------------------------------------------------
  // 2) Get a specific notification (NotificationUser-based)
  // ---------------------------------------------------
  @Version('1')
  @Get(':id')
  @Roles(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notification details for a user (via NotificationUser ID)' })
  @HttpCode(200)
  async getNotification(@Param('id', new MongoIdPipe()) id: string) {
    return this.notificationService.getNotification(id);
  }

  // ---------------------------------------------------
  // 3) Mark as read/unread
  // ---------------------------------------------------
  @Version('1')
  @Patch('read/:notificationUserId')
  @Roles(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a notification as read/unread for logged-in user' })
  @HttpCode(200)
  async markRead(@LoginUser() user: UserDocument, @Param('notificationUserId', new MongoIdPipe()) notificationUserId: string) {
    return this.notificationService.markAsRead(user._id.toString(), notificationUserId);
  }

  // ---------------------------------------------------
  // 4) Mark all as read
  // ---------------------------------------------------
  @Version('1')
  @Patch('read-all')
  @Roles(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read for logged-in user' })
  @HttpCode(200)
  async markAllRead(@LoginUser() user: UserDocument) {
    return this.notificationService.markAllAsRead(user._id.toString());
  }

  // ---------------------------------------------------
  // 5) Soft delete a notification (NotificationUser-based)
  // ---------------------------------------------------
  @Version('1')
  @Delete(':notificationUserId')
  @Roles(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft delete a notification for the user (via NotificationUser ID)',
  })
  @HttpCode(200)
  async deleteNotification(@LoginUser() user: UserDocument, @Param('notificationUserId', new MongoIdPipe()) notificationUserId: string) {
    return this.notificationService.deleteUserNotification(user._id, notificationUserId);
  }

  // ---------------------------------------------------
  // 6) Soft delete all notifications
  // ---------------------------------------------------
  @Version('1')
  @Delete()
  @Roles(UserRole.USER)
  @UseGuards(AuthGuard('jwt'), RBAcGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete all notifications for the logged-in user' })
  @HttpCode(200)
  async deleteAllNotifications(@LoginUser() user: UserDocument) {
    return this.notificationService.deleteAllUserNotifications(user._id);
  }
}
