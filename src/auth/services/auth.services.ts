import { Injectable ,Post ,Get, HttpException, UnauthorizedException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AnyARecord } from "dns";
import { Model } from "mongoose";
import { AuthSchema } from "src/schemas/auth.schemas";
import { User } from "src/schemas/user.schema";
import { errorMessage } from "src/utils/response.util";
@Injectable()
export class AuthServices{

    constructor(@InjectModel(User.name)private userModel: Model<User>) {}
 
    async findemail(email:string , password:string): Promise<any>{
        const user= await this.userModel.find({email,password})
        return user
    }

    async verifypassword(user:string ,userpassword:string): Promise<any>{
        const pass= await this.userModel.find({user ,userpassword});
        return pass
    }
    

    // async login(credentials: AuthSchema): Promise<any> {
    //     const user = await this.findemail(credentials.email,credentials.password);
    
    //     if (!user || !(await this.verifypassword(user, credentials.password))) {
    //       throw new UnauthorizedException('Invalid credentials');
    //     }
    // }
    


   
   


   
}