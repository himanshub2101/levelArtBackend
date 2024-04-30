import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { Posts } from './posts.schema';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  type: string; // Type of notification (like, comment, follow)

  @Prop({ type: User, required: true })
  sender: User; // User who performed the action

  @Prop({ type: User, required: true })
  recipient: User; // User who receives the notification

  @Prop({ type: Posts, required: true })
  post: Posts; // Post associated with the action
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
