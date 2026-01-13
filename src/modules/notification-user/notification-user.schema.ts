import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class NotificationUser {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Notification', required: true })
  notificationId: string | Types.ObjectId;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User', index: true })
  userId: string | Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: true })
  isDelivered: boolean; // after sending push
}

export const NotificationUserSchema = SchemaFactory.createForClass(NotificationUser);
NotificationUserSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });
export type NotificationUserDocument = NotificationUser & HydratedDocument<NotificationUser>;