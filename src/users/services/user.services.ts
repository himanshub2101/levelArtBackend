import { Injectable } from "@nestjs/common";
import {InjectModel}from "@nestjs/mongoose"
import { User } from "src/schemas/user.schema";
import { Model } from 'mongoose'; // Import the Model type from mongoose

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
}

