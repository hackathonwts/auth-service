import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationUser, NotificationUserSchema } from './notification-user.schema';
import { NotificationUserRepository } from './notification-user.repository';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: NotificationUser.name,
        useFactory: () => {
          const schema = NotificationUserSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [],
  providers: [NotificationUserRepository],
  exports: [NotificationUserRepository],
})
export class NotificationUserModule {}
