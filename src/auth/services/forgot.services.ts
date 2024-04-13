import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User } from "src/schemas/user.schema"
// import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken'
@Injectable()
export class ForgotService{
  constructor(@InjectModel(User.name)private userModel: Model<User>) {}  
  async findemail(email:string):Promise<any>{
    const user= await this.userModel.find({email})
    return user
  }

  async generatePasswordResetToken(userId: string){

    console.log(userId)
    const resettoken = jwt.sign({ userId }, '#12345', { expiresIn: '1h' });
    return resettoken
  }


}