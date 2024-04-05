// posts.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Posts extends Document {
  @Prop()
  postedBy: Types.ObjectId;

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
