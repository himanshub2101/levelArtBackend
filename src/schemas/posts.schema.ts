import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Posts extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' }) // Reference to User model
  postedBy: Types.ObjectId; // Reference to User model

  @Prop()
  text: string;

  @Prop()
  img: string;

  @Prop()
  likes: Types.ObjectId[];

  @Prop()
  replies: {
    userId: Types.ObjectId;
    text: string;
    userProfilePic: string;
    username: string;
  }[];
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
export type PostDocument = Posts & Document; // Define PostDocument type
