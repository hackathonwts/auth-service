import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { ApiResponse } from '@common/types/api-response.type';
import { Messages } from '@common/constants/messages';
import { successResponse } from '@helpers/response.helper';
import { MulterS3File } from '@common/types/multer-s3-file';
import { CreateNotificationDto, FilterNotificationDto } from './notification.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationRepository } from './notification.repository';
import { NotificationUserRepository } from '@modules/notification-user/notification-user.repository';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notification-queue') private readonly notificationQueue: Queue,
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationUserRepository: NotificationUserRepository,
  ) {}

  /**
   * Retrieve a list of notifications based on the given filter
   * @param dto A FilterNotificationDto object containing the filter parameters
   * @returns A promise resolving an ApiResponse object containing the list of notifications
   * @throws NotFoundException If no notifications are found
   */
  public async getNotifications(dto: FilterNotificationDto): Promise<ApiResponse> {
    const notifications = await this.notificationRepository.getAll(dto);
    return successResponse(notifications, 'Notification list fetched successfully.');
  }

  /**
   * Retrieve a notification by its ID
   * @param id The ID of the notification to retrieve
   * @returns A promise resolving an ApiResponse object
   * @throws NotFoundException If the notification is not found
   */
  public async getNotification(id: string): Promise<ApiResponse> {
    const notification = await this.notificationRepository.getByField({
      _id: new mongoose.Types.ObjectId(id),
      isDeleted: false,
    });

    if (!notification) throw new NotFoundException('Notification not found!');

    return successResponse(notification.toObject(), 'Notification details retrieved successfully.');
  }

  /**
   * Create a new notification with given details.
   *
   * @param body Notification details (title, message, audience, userIds, gateways, thumbnail, attachments)
   * @param files File uploads (thumbnail or attachments)
   * @returns Promise<ApiResponse>
   * @throws BadRequestException
   */
  public async createNotification(body: CreateNotificationDto, files: Record<string, MulterS3File[]>): Promise<ApiResponse> {
    try {
      // ----------------------------------------------------
      // STEP 1: Handle File Uploads (thumbnail or attachments)
      // ----------------------------------------------------
      if (files && Object.keys(files).length > 0) {
        if (files['thumbnail']) {
          body.thumbnail = files['thumbnail'][0].location;
        }
        if (files['files']) {
          body['attachments'] = files['files'].map((f) => f.location);
        }
      }

      // ----------------------------------------------------
      // STEP 2: Create Notification Record
      // ----------------------------------------------------
      const notification = await this.notificationRepository.save(body);
      if (!notification) throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);

      // ----------------------------------------------------
      // STEP 3: All the logic implemented for Queue Notification Sending and Store NotificationUsers
      // ----------------------------------------------------
      const notificationPayload = { ...body, notificationId: notification._id };

      if (notificationPayload.deliverAt) {
        // Scheduled message (future)
        await this.notificationQueue.add('broadcast-notification', notificationPayload, { delay: new Date(body.deliverAt).getTime() - Date.now() });
      } else {
        // Instant sending
        await this.notificationQueue.add('send-notification', notificationPayload);
      }

      // ----------------------------------------------------
      // DONE
      // ----------------------------------------------------
      return successResponse(notification, 'Notification created successfully.');
    } catch (error) {
      throw new BadRequestException(error.message || Messages.SOMETHING_WENT_WRONG);
    }
  }

  /**
   * Soft delete a notification
   * @param id The ID of the notification to delete
   * @returns A promise resolving an ApiResponse object
   * @throws BadRequestException If the deletion fails
   */
  public async deleteNotification(id: string): Promise<ApiResponse> {
    const deletedNotification = await this.notificationRepository.delete(new Types.ObjectId(id));

    if (deletedNotification instanceof Error) {
      throw new BadRequestException(deletedNotification.message);
    }

    await this.notificationUserRepository.bulkDelete({ notification_id: new Types.ObjectId(id) });

    if (!deletedNotification) {
      throw new BadRequestException(deletedNotification instanceof Error ? deletedNotification.message : Messages.SOMETHING_WENT_WRONG);
    }

    return successResponse(null, 'Notification deleted successfully.');
  }

  /**
   * Mark a notification as read
   * @param userId The ID of the user who owns the notification user relationship
   * @param notificationUserId The ID of the notification user relationship to mark as read
   * @returns A promise resolving an ApiResponse object
   * @throws BadRequestException If the update fails
   */
  public async markAsRead(userId: string, notificationUserId: string): Promise<ApiResponse> {
    const result = await this.notificationUserRepository.updateByField({ isRead: true }, { _id: new Types.ObjectId(notificationUserId), user_id: new Types.ObjectId(userId), isDeleted: false });

    if (!result) {
      throw new BadRequestException(result instanceof Error ? result.message : Messages.SOMETHING_WENT_WRONG);
    }

    return successResponse(null, 'Notification marked as read successfully.');
  }

  /**
   * Mark all notifications as read for a user
   * @param userId The ID of the user who owns the notifications
   * @returns A promise resolving an ApiResponse object
   * @throws BadRequestException If the update fails
   */
  public async markAllAsRead(userId: string): Promise<ApiResponse> {
    const result = await this.notificationUserRepository.updateAllByParams({ isRead: true }, { user_id: new Types.ObjectId(userId), isDeleted: false });

    if (!result) {
      throw new BadRequestException(result instanceof Error ? result.message : Messages.SOMETHING_WENT_WRONG);
    }

    return successResponse(null, 'All notifications marked as read successfully.');
  }

  /**
   * Delete a user notification by ID
   * This will delete the notification user relationship, but not the notification itself
   * @param userId The ID of the user who owns the notification user relationship
   * @param notificationUserId The ID of the notification user relationship to delete
   * @returns A promise resolving an ApiResponse object
   * @throws NotFoundException If the notification user relationship is not found
   * @throws BadRequestException If the deletion fails
   */
  public async deleteUserNotification(userId: Types.ObjectId, notificationUserId: string): Promise<ApiResponse> {
    // Check if the notificationUser exists for the user
    const notificationUser = await this.notificationUserRepository.getByField({ _id: new Types.ObjectId(notificationUserId), user_id: userId });

    if (!notificationUser) {
      throw new NotFoundException('NotificationUser not found for the user!');
    }

    const result = await this.notificationUserRepository.delete(new Types.ObjectId(notificationUserId));

    if (!result) {
      throw new BadRequestException(result instanceof Error ? result.message : Messages.SOMETHING_WENT_WRONG);
    }

    return successResponse(null, 'User notification deleted successfully.');
  }

  /**
   * Delete all user notifications
   * This will delete all notification user relationships for the user
   * @param userId The ID of the user who owns the notification user relationships
   * @returns A promise resolving an ApiResponse object
   * @throws BadRequestException If the deletion fails
   */
  public async deleteAllUserNotifications(userId: Types.ObjectId): Promise<ApiResponse> {
    const result = await this.notificationUserRepository.bulkDelete({ user_id: userId });

    if (!result) {
      throw new BadRequestException(result instanceof Error ? result.message : Messages.SOMETHING_WENT_WRONG);
    }

    return successResponse(null, 'All user notifications deleted successfully.');
  }
}
