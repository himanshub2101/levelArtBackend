import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  postId: string;

  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
