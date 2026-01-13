import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '../schemas/permission.schema';
import { PermissionRepository } from './permission.repository';

@Global()
@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Permission.name,
                useFactory: () => {
                    const schema = PermissionSchema;
                    return schema;
                },
            },
        ]) 
    ],
    controllers: [],
    providers: [PermissionRepository],
    exports: [PermissionRepository]
})
export class PermissionRepositoryModule {}
