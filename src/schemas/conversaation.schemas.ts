import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the LastMessage interface
interface LastMessage {
  text: string;
  sender: string;
}

@Schema()
export class Conversation extends Document {
  @Prop([String])
  participants: string[];

  @Prop({ type: Object, required: true }) // Define lastMessage as an object type
  lastMessage: LastMessage; // Use the LastMessage interface as the type for lastMessage
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
