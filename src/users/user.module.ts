import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from "./controller/user.controller";
import { User, UserSchema } from "src/schemas/user.schema";
import { UserService } from "./services/user.services";

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService,MongooseModule],

  })

export class UserModule{}