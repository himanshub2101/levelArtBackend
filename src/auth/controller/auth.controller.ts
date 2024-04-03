import { Get,Post,Body, Controller, HttpException, HttpStatus } from "@nestjs/common";
import { AuthSchema } from "src/schemas/auth.schemas";
import { AuthServices } from "../services/auth.services";
import { User } from "src/schemas/user.schema";
import { errorMessage, successMessage } from "src/utils/response.util";
import * as jwt from 'jsonwebtoken'

@Controller('auth')
export class AuthController{
     constructor(private AuthServices:AuthServices){}
     @Post('/login')
    async userLogin(@Body() loginData: AuthSchema): Promise<any> {

    try {

      const user = await this.AuthServices.findemail(loginData.email,  loginData.password);

      if (!user) {

        throw new HttpException(errorMessage.unauthorizedError, HttpStatus.UNAUTHORIZED);

      }

      const isPasswordValid = await this.AuthServices.verifypassword(user, loginData.password);

      if (!isPasswordValid) {
         throw new HttpException(errorMessage.unauthorizedError, HttpStatus.UNAUTHORIZED);
      }

      const token = jwt.sign({ email: user.email, userId: user.id }, '#12345', { expiresIn: '1h' });


     return { success: successMessage.userLoggedIn , token };

    } catch (error) {

      return { success: false, error: 'Authentication failed' };
    }
  }

  
}

