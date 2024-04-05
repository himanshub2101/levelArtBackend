// message.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop()
  conversationId: string;

  @Prop()
  sender: string;

  @Prop()
  text: string;

  @Prop()
  img: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
