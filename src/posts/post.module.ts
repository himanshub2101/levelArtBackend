import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './controllers/posts.controller';
import { PostService } from './services/posts.services';
import { Posts, PostsSchema } from 'src/schemas/posts.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/users/services/user.services';

@Module({
  imports: [
   
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService,UserService],
  exports: [UserService]
})
export class PostModule {} 
