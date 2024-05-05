// user.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async register(signUpDto: User): Promise<User> {
    const { username, password, email, phonenumber,confirmpassword,userType, fullname, gender, pronouns } = signUpDto;

    // Check if the email is already registered
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const user = new this.userModel({ username, password: hashedPassword, email, phonenumber,confirmpassword,userType,fullname,gender, pronouns });
    const newUser = await user.save();

    const { confirmpassword: _, ...registeredUser } = newUser.toObject();
    return registeredUser as User;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUser(id: string, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(id: string): Promise<{ success: boolean }> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
    return { success: true };
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
