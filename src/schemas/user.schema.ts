// cat.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';


@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  confirmpassword: string;

  @Prop({ required: true })
  phonenumber: string;

  @Prop({ default: [] })
  followers: string[]; // Array of follower user IDs

  @Prop({ default: [] })
  followings: string[]; // Array of following user IDs

  @Prop({ default: '' })
  profilePic: string; // URL of the user's profile picture

  @Prop({ default: '' })
  bio: string; // Biography of the user

  @Prop({ default: false })
  isFrozen: boolean; // Indicates if the user's account is frozen
}
export const UserSchema = SchemaFactory.createForClass(User);

export const userModel: Model<User> = mongoose.model('User', UserSchema);