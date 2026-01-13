import { Module } from '@nestjs/common';
import { Permission } from './permission';
import { PermissionsController } from './controllers/admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSchema } from './schemas/permission.schema';
import { PermissionsService } from './permission.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
