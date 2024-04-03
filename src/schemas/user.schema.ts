// cat.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';


@Schema()
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

}
export const UserSchema = SchemaFactory.createForClass(User);

export const userModel: Model<User> = mongoose.model('User', UserSchema);