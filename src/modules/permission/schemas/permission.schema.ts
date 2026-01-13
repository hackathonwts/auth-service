import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PermissionAction } from '../dto/permission.dto';

@Schema({ timestamps: true, versionKey: false })
export class Permission {
  @Prop({ type: String, required: true, unique: true, index: true })
  key: string;

  @Prop({ type: String, required: true })
  module: string;

  @Prop({ enum: PermissionAction, required: true })
  action: PermissionAction;

  @Prop({ type: String })
  description?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export type PermissionDocument = HydratedDocument<Permission>;
export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.index({ key: 1, isActive: 1 });
