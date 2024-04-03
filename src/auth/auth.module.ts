import { Module } from "@nestjs/common";
import { AuthServices } from "./services/auth.services";
import { AuthController } from "./controller/auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";
import { ForgotController } from "./controller/forgot.controller";
import { ForgotService } from "./services/forgot.services";
import { MailService } from "./services/mail.services";

@Module({
    imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers:[AuthController , ForgotController],
    providers:[AuthServices,ForgotService,MailService]
})
export class AuthModule{

}