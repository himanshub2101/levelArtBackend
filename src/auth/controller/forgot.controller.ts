import { Post, Body, HttpException, HttpStatus, Controller } from "@nestjs/common";
import { AuthServices } from "../services/auth.services";
import { ForgotService } from "../services/forgot.services";
import { MailService } from "../services/mail.services";
import { User } from "src/schemas/user.schema";
@Controller('auth')
export class ForgotController{
   constructor(private forgotService :ForgotService,
    private authService :AuthServices,
    private mailService :MailService){}

   @Post('/forgot-password')
  async forgotPassword(@Body()users: User): Promise<any> {

      try {
        console.log("before")
      const user = await this.forgotService.findemail(users.email);
      console.log(user)
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      console.log("after")

     const token = await this.forgotService.generatePasswordResetToken(user._id);
console.log(token)
      await this.mailService.sendPasswordResetEmail(user.email, token);

      return { success: true, message: 'Password reset link sent to your email' };
    } catch (error) {
      return { success: false, error: 'Failed to send password reset link' };
    }
  }
}