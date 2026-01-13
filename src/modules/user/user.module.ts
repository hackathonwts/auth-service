import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminController } from './controllers/admin.controller';
import { UserController } from './controllers/user.controller';
import { QueueModule } from '@common/queue/queue.module';
import { UserRepository } from './user.repository';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        },
      },
    ]),
    QueueModule,
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
