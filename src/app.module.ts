import { Module } from '@nestjs/common';
import { HelpersModule } from '@helpers/helpers.module';
import { RefreshTokenModule } from '@modules/refresh-token/refresh-token.module';
import { RoleModule } from '@modules/role/role.module';
import { UserDeviceRepositoryModule } from '@modules/user-devices/repository/user-device-repository.module';
import { UsersModule } from '@modules/user/user.module';
import { CmsModule } from '@modules/cms/cms.module';
import { CmsRepositoryModule } from '@modules/cms/repositories/cms.repository.module';
import { RoleRepositoryModule } from '@modules/role/repositories/role.repository.module';
import { ApiConfigModule } from './config.module';
import { AuthModule } from '@modules/auth/auth.module';
import { QueueModule } from '@common/queue/queue.module';
import { RedisModule } from '@common/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationModule } from '@modules/notification/notification.module';
import { NotificationUserModule } from '@modules/notification-user/notification-user.module';
import { MediaModule } from '@modules/media/media.module';
import { PermissionsModule } from './modules/permission/permission.module';
import { PermissionRepositoryModule } from '@modules/permission/repositories/pemission.repository.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ApiConfigModule,
    HelpersModule,
    RedisModule,
    BullModule.forRootAsync({
      useFactory: (redis: any) => ({
        connection: redis,
      }),
      inject: ['REDIS_CONNECTION'],
    }),
    QueueModule,
    MediaModule,
    AuthModule,
    RefreshTokenModule,
    RoleModule,
    UserDeviceRepositoryModule,
    UsersModule,
    CmsModule,
    CmsRepositoryModule,
    RoleRepositoryModule,
    NotificationModule,
    NotificationUserModule,
    PermissionsModule,
    PermissionRepositoryModule,
    KafkaModule,
  ],
  providers: [],
})
export class AppModule {}
