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
import { SearchModule } from './search/search.module';
const bodyParser = require('body-parser'); // Import bodyParser using CommonJS syntax

@Module({
  imports: [    
    MulterModule.register(multerConfig),
    FollowersModule,
    PostModule, // Add PostModule here
    ConversationModule,
    AuthModule,
    UserModule,
    SearchModule,
    MongooseModule.forRoot('mongodb+srv://himanshubaghel7723:p6eoUVJJjvjkasKB@cluster0.tdpw1ax.mongodb.net/'),
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]), // Add this line
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth/profile');
    // consumer.apply(bodyParser.json({ limit: '50mb' })).forRoutes('*');
    // consumer.apply(bodyParser.urlencoded({ extended: true, limit: '50mb' })).forRoutes('*');

    // consumer.apply(AuthMiddleware).forRoutes('posts/create-post'); 

  }
}
