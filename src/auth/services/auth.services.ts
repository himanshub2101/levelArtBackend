import { Injectable ,Post ,Get} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthSchema } from "src/schemas/auth.schemas";
import { User } from "src/schemas/user.schema";
@Injectable()
export class AuthServices{

    constructor(@InjectModel(User.name)private userModel: Model<User>) {}
    @Post()
    async login(email:string , password:string){
    
        return await this.userModel.findOne({email,password})


    }



   
}