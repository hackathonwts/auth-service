import { MongooseModuleOptions } from '@nestjs/mongoose';
export declare const RootMongooseTestModule: (options?: MongooseModuleOptions) => import("@nestjs/common").DynamicModule;
export declare const CloseInMongodConnection: () => Promise<void>;
