import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [ConversationModule,AuthModule,UserModule,MongooseModule.forRoot('mongodb+srv://himanshubaghel7723:p6eoUVJJjvjkasKB@cluster0.tdpw1ax.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// mongodb pw p6eoUVJJjvjkasKB

//mongodb+srv://himanshubaghel7723:p6eoUVJJjvjkasKB@cluster0.tdpw1ax.mongodb.net/