import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsMongoId, IsBoolean, IsObject, IsDateString, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { NotificationAudience, NotificationType } from './notification.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ----------------------------------------------------------
// CREATE NOTIFICATION DTO
// ----------------------------------------------------------
export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification title',
    example: 'New Feature Update!',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Notification message body',
    example: 'We have released a new update with exciting features.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.GENERAL,
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({
    description: 'Target audience for the notification',
    enum: NotificationAudience,
    example: NotificationAudience.ALL,
  })
  @IsEnum(NotificationAudience)
  @IsNotEmpty()
  audience: NotificationAudience;

  @ApiPropertyOptional({
    description: 'User IDs (Required only when audience = CUSTOM)',
    type: [String],
    example: ['65c8a99e24a91c7ac9c9a012', '65c8a99e24a91c7ac9c9a013'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  userIds?: string[];

  @ApiProperty({
    description: 'Gateways for delivering the notification',
    isArray: true,
    enum: ['fcm', 'sms', 'email'],
    example: ['fcm', 'email'],
  })
  @IsArray()
  @IsNotEmpty()
  gateways: Array<'fcm' | 'sms' | 'email'>;

  @ApiPropertyOptional({
    description: 'Additional metadata object (optional)',
    example: { orderId: '123456', priority: 'high' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Schedule date/time for delayed delivery',
    example: '2025-12-15T10:30:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : value))
  deliverAt?: string;
}

// ----------------------------------------------------------
// FILTER + PAGINATION DTO
// ----------------------------------------------------------
export class FilterNotificationDto {
  @ApiPropertyOptional({
    description: 'Search by title/message',
    example: 'update',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by notification type',
    enum: NotificationType,
    example: NotificationType.SYSTEM,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({
    description: 'Filter by audience type',
    enum: NotificationAudience,
    example: NotificationAudience.ALL,
  })
  @IsOptional()
  @IsEnum(NotificationAudience)
  audience?: NotificationAudience;

  @ApiPropertyOptional({
    description: 'Filter by read/unread status',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({
    description: 'Filter notifications for single user',
    example: '65c8a99e24a91c7ac9c9a011',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of results per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}

// ----------------------------------------------------------
// UPDATE NOTIFICATION USER STATUS DTO
// ----------------------------------------------------------
export class UpdateNotificationUserStatusDto {
  @ApiProperty({
    description: 'Mark notification as read/unread',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isRead: boolean;
}
