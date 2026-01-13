import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
}

export enum MediaStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Media {
  // ------------------------
  // Added By User
  // ------------------------

  @Prop({ required: true })
  userID: string; // userId (string for flexibility)

  // ------------------------
  // FILE IDENTIFICATION
  // ------------------------

  @Prop({ required: true })
  originalName: string; // uploaded file name

  @Prop({ required: true })
  fileName: string; // stored file name (uuid.ext)

  @Prop({ required: true })
  mimeType: string; // image/png, video/mp4, etc.

  @Prop({ required: true })
  extension: string; // png, jpg, mp4

  @Prop({ required: true })
  size: number; // bytes

  // ------------------------
  // STORAGE
  // ------------------------

  @Prop({ required: true })
  url: string; // public URL (S3, Cloudinary, local)

  @Prop()
  bucket?: string; // S3 bucket / storage name

  @Prop()
  key?: string; // S3 object key / Cloudinary public_id

  // ------------------------
  // MEDIA META
  // ------------------------

  @Prop({ enum: MediaType, required: true })
  type: MediaType;

  @Prop()
  width?: number; // for images/videos

  @Prop()
  height?: number;

  @Prop()
  duration?: number; // seconds (for video/audio)

  // ------------------------
  // OWNERSHIP & TAGGING
  // ------------------------

  @Prop()
  uploadedBy?: string; // userId (string for flexibility)

  @Prop({ type: [String], default: [] })
  tags?: string[];

  // ------------------------
  // STATE
  // ------------------------

  @Prop({ enum: MediaStatus, default: MediaStatus.ACTIVE })
  status: MediaStatus;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

// Useful indexes
MediaSchema.index({ type: 1 });
MediaSchema.index({ uploadedBy: 1 });
MediaSchema.index({ isDeleted: 1 });
