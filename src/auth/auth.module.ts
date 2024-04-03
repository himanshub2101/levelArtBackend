import { Module } from "@nestjs/common";
import { AuthServices } from "./services/auth.services";
import { AuthController } from "./controller/auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";

@Module({
    imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers:[AuthController],
    providers:[AuthServices]
})
export class AuthModule{

}