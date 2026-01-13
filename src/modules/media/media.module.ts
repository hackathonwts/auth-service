import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaRepository } from './media.repository';
import { Media, MediaSchema } from './media.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Media.name,
        useFactory: () => {
          const schema = MediaSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [],
  providers: [MediaRepository],
  exports: [MediaRepository],
})
export class MediaModule {}
