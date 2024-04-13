import { Controller, Post, Body, Req, Res, Param, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConversationService } from '../services/conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('send-message')
  async sendMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const { recipientId, message, img } = req.body;
      const senderId = req['user']; // Use req['user'] directly as the user ID

      let conversation = await this.conversationService.findConversation(senderId, recipientId);

      if (!conversation) {
        conversation = await this.conversationService.createConversation(senderId, recipientId, message);
      }

      if (img) {
        // Upload image logic here
      }

      const newMessage = await this.conversationService.saveMessage(conversation._id, senderId, message, img);

      // Send message logic here

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('messages/:otherUserId')
  async getMessages(@Param('otherUserId') otherUserId: string, @Req() req: Request, @Res() res: Response) {
    const userId = req['user']; // Use req['user'] directly as the user ID
    try {
      const conversation = await this.conversationService.findConversation(userId, otherUserId);

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const messages = await this.conversationService.getMessages(conversation._id);

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('conversations')
  async getConversations(@Req() req: Request, @Res() res: Response) {
    const userId = req['user']; // Use req['user'] directly as the user ID
    try {
      const conversations = await this.conversationService.getConversations(userId);

      // Remove the current user from the participants array
      conversations.forEach(conversation => {
        conversation.participants = conversation.participants.filter(participant => participant !== userId);
      });

      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
