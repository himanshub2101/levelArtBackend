// conversation.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from '../../schemas/conversaation.schemas';
import { Message } from '../../schemas/message.schemas';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async findConversation(senderId: string, recipientId: string): Promise<Conversation> {
    return this.conversationModel.findOne({ participants: { $all: [senderId, recipientId] } }).exec();
  }

  async createConversation(senderId: string, recipientId: string, message: string): Promise<Conversation> {
    const conversation = new this.conversationModel({
      participants: [senderId, recipientId],
      lastMessage: {
        text: message,
        sender: senderId,
      },
    });
    return conversation.save();
  }

  async saveMessage(conversationId: string, senderId: string, message: string, img?: string): Promise<Message> {
    const newMessage = new this.messageModel({
      conversationId,
      sender: senderId,
      text: message,
      img: img || '',
    });
    await Promise.all([
      newMessage.save(),
      this.conversationModel.updateOne({ _id: conversationId }, {
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);
    return newMessage;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messageModel.find({ conversationId }).sort({ createdAt: 1 }).exec();
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return this.conversationModel.find({ participants: userId }).populate({
      path: "participants",
      select: "username profilePic",
    }).exec();
  }
}
