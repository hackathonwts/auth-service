import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategy/auth.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { RefreshToken, RefreshTokenSchema } from '@modules/refresh-token/schemas/refresh-token.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminController, AdminProfileController } from './controllers/admin.controller';
import { UserController } from './controllers/user.controller';
import { QueueModule } from '@common/queue/queue.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    QueueModule
  ],
  controllers: [UserController, AdminController, AdminProfileController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
