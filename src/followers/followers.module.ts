import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from "src/schemas/user.schema";
import { FollowersService } from "./services/followers.services";
import { FollowersController } from "./controllers/followers.controllers";

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [FollowersController],
    providers: [FollowersService],

  })

export class FollowersModule{}