import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { PostModule } from './posts/post.module'; // Import PostModule
import { PostController } from './posts/controllers/posts.controller';
import { PostService } from './posts/services/posts.services';
import { Posts, PostsSchema } from './schemas/posts.schema';
import { AuthMiddleware } from './auth/auth.middleware';
import { FollowersModule } from './followers/followers.module';
import { multerConfig } from './multer.config';
import { MulterModule } from '@nestjs/platform-express/multer';

@Module({
  imports: [    MulterModule.register(multerConfig),
    FollowersModule,
    PostModule, // Add PostModule here
    ConversationModule,
    AuthModule,
    UserModule,
    MongooseModule.forRoot('mongodb+srv://himanshubaghel7723:p6eoUVJJjvjkasKB@cluster0.tdpw1ax.mongodb.net/'),
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]), // Add this line
  ],
  controllers: [AppController, PostController],
  providers: [AppService, PostService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth/profile');
    // consumer.apply(AuthMiddleware).forRoutes('posts/create-post'); 

  }
}
