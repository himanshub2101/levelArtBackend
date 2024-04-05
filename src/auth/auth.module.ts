import { Module } from "@nestjs/common";
import { AuthServices } from "./services/auth.services";
import { AuthController } from "./controller/auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";
import { ForgotController } from "./controller/forgot.controller";
import { ForgotService } from "./services/forgot.services";
import { MailService } from "./services/mail.services";
import { UserModule } from "src/users/user.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),UserModule,
    JwtModule.register({
        global: true,
        secret: 'qejw984jif',
        signOptions: { expiresIn: '60s' },
      }),
],
    controllers:[AuthController , ForgotController],
    providers:[AuthServices,ForgotService,MailService]
})
export class AuthModule{

}