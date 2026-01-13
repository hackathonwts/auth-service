import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  GENERAL = 'general',
  SYSTEM = 'system',
  EVENT = 'event',
  PROMOTION = 'promotion',
}

export enum NotificationAudience {
  ALL = 'all',
  USERS = 'users',
  ADMINS = 'admins',
  CUSTOM = 'custom',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop()
  message?: string;

  @Prop()
  thumbnail?: string;

  @Prop({
    enum: NotificationType,
    required: true,
  })
  type: NotificationType;

  @Prop({
    enum: NotificationAudience,
    required: true,
  })
  audience: NotificationAudience;

  @Prop({
    type: [String],
    required: true,
    enum: ['fcm', 'sms', 'email'],
  })
  gateways: string[];

  // Extra metadata
  @Prop({ type: Object })
  metadata?: Record<string, any>;

  // Schedule delivery
  @Prop({ type: Date })
  deliverAt?: Date | string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ createdAt: -1 });
