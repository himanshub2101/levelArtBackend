import { Injectable, NotFoundException } from "@nestjs/common";
import {InjectModel}from "@nestjs/mongoose"
import { User } from "src/schemas/user.schema";
import { Model } from 'mongoose'; // Import the Model type from mongoose
import { errorMessage, successMessage } from "src/utils/response.util";

@Injectable()

export class UserService {
    constructor(@InjectModel(User.name)private userModel: Model<User>) {}

      async register(signUpDto: User): Promise<User> {
    
        const {username,password, confirmpassword, email,phonenumber} = signUpDto


        const user = await this.userModel.create({email,username,password,confirmpassword,phonenumber})
       
        return user.save()
    }


    async findEmail(email: string):Promise<User[]>{

const findByEmail = await this.userModel.find({email})

          return findByEmail
    }


    async findOne(username: string): Promise<User | undefined> {
      return this.userModel.findOne({ username: username }).exec();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.userModel.findById(userId).lean().exec();
  }

  async findManyByIds(userIds: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: userIds } }).lean().exec();
  }  
 
  
    //Get all the users
    async findAll(): Promise<{ success: boolean; user: User[] }> {
      const user = await this.userModel.find();
      return { success: true, user };
    }
  
    //Fetch Unique user by id
    async findbyId(id: string): Promise<User> {
      try {
        const user = await this.userModel.findById(id);
        if (!user) {
          console.log(`User with ID ${id} not found.`);
          throw new NotFoundException('User not found');
        }
        return user;
      } catch (error) {
        // Log the error for further investigation
        console.error('Error in findbyId:', error);
        throw error; // Rethrow the error
      }
    }
  
    //Update user by id
    async updateById(id: string, updateUserDto: User): Promise<User> {
      // Find the user by ID
      const existingUser = await this.userModel.findById(id);
  
      // If user not found, throw NotFoundException
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
  
      Object.assign(existingUser, updateUserDto);
  
      // Save the updated user
      const updatedUserData = await existingUser.save();
  
      return updatedUserData;
    }
  
    async deleteById(
      id: string,
    ): Promise<{ success: boolean; message?: any }> {
      // Find the user by ID
      const existingUser = await this.userModel.findById(id);
  
      // If user not found, throw NotFoundException
      if (!existingUser) {
        throw new NotFoundException(errorMessage.userNotFound);
      }
      await this.userModel.deleteOne({ user: existingUser._id });
      // Delete the user
      await this.userModel.deleteOne({ _id: id });
  
      return { success: true, message: successMessage.deleteUser };
    }
}

