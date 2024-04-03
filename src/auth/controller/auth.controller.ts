import { Get,Post,Body, Controller } from "@nestjs/common";
import { AuthSchema } from "src/schemas/auth.schemas";
import { AuthServices } from "../services/auth.services";

@Controller('auth')
export class AuthController{
     constructor(private AuthServices:AuthServices){}
     @Post()
    async login(@Body() credential :AuthSchema){
        return this.AuthServices.login(credential.email,credential.password);
    }

    

}