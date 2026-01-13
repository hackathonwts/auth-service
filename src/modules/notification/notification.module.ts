import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminNotificationController } from './controllers/admin.controller';
import { NotificationService } from './notification.service';
import { Notification, NotificationSchema } from './notification.schema';
import { UserNotificationController } from './controllers/user.controller';
import { QueueModule } from '@common/queue/queue.module';
import { NotificationRepository } from './notification.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      // Notification Schema
      {
        name: Notification.name,
        useFactory: () => {
          const schema = NotificationSchema;
          return schema;
        },
      },
    ]),
    QueueModule,
  ],
  controllers: [AdminNotificationController, UserNotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
