import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from "src/schemas/user.schema";
import { ConversationController } from "./controllers/conversation.controller";
import { ConversationService } from "./services/conversation.service";
import { Conversation, ConversationSchema } from "src/schemas/conversaation.schemas";
import { Message, MessageSchema } from "src/schemas/message.schemas";

@Module({
    imports: [MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ])],
    controllers: [ConversationController],
    providers: [ConversationService],
    exports: [],

  })

export class ConversationModule{}