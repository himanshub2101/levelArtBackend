// // import { Injectable, NotFoundException } from '@nestjs/common';
// // import { InjectModel } from '@nestjs/mongoose';
// // import { Model } from 'mongoose';
// // import { Notification } from 'src/schemas/notification.schema';
// // import { UserService } from 'src/users/services/user.services';

// // @Injectable()
// // export class NotificationService {

// //     constructor(
// //         @InjectModel(Notification.name) private notificationModel: Model<Notification>,
// //         private readonly userService: UserService,
// //     ){}

// //     createNotification(notification: Notification): Promise<Notification>{
// //         return this.notificationModel.create(notification);
// //     }

// //     async createPostLikeNotification(postId: string, userId: string): Promise<Notification> {
// //         // Fetch the username of the user who liked the post
// //         const user = await this.userService.findOneById(userId);
// //         if (!user) {
// //             throw new NotFoundException('User not found');
// //         }

// //         const username = user.username;

// //         // Create a new notification with the sender's username
// //         const notification = new this.notificationModel({
// //             postId,
// //             userId,
// //             sender: username, // Use the username as the sender
// //             message: `Your post (${postId}) has been liked by user ${username}`,
// //             createdAt: new Date(),
// //         });

// //         return notification.save(); // Save the notification to the database
// //     } 

// //     findAll(): Promise<Notification[]> {
// //         return this.notificationModel.find().exec();
// //     }

// //     findOne(id: string): Promise<Notification | null> {
// //         return this.notificationModel.findById(id).exec();
// //     }
// // }

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Notification } from '../../schemas/notification.schema';

// @Injectable()
// export class NotificationService {
//   constructor(
//     @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
//   ) {}

//   async createNotification(userId: string, message: string, postId: string): Promise<Notification> {
//     const newNotification = new this.notificationModel({ userId, message, postId });
//     return await newNotification.save();
//   }

//   async createLikeNotificationForPostOwner(likedPostOwnerId: string, likerId: string, postId: string): Promise<Notification> {
//     const message = `Your post was liked by user ${likerId}`;
//     return await this.createNotification(likedPostOwnerId, message, postId);
//   }

//   async getNotificationsByUserId(userId: string): Promise<Notification[]> {
//     return await this.notificationModel.find({ userId }).exec();
//   }

//   async deleteNotification(notificationId: string): Promise<boolean> {
//     const deletedNotification = await this.notificationModel.findByIdAndDelete(notificationId).exec();
//     return !!deletedNotification;
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(type: string, sender: string, recipient: string, postId: string): Promise<Notification> {
    try {
      console.log(`Creating notification of type ${type} from sender ${sender} to recipient ${recipient} for post ${postId}`);
      const newNotification = new this.notificationModel({
        type,
        sender,
        recipient,
        postId,
        read: false, // Default notification status to unread
      });
      const savedNotification = await newNotification.save();
      console.log('Notification created successfully:', savedNotification);
      return savedNotification;
    } catch (error) {
      console.error('Error creating notification:', error.message);
      throw new Error('Failed to create notification');
    }
  }

  async getNotificationsForUser(userId: string, page: number = 1, limit: number = 10): Promise<Notification[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.notificationModel
        .find({ recipient: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await this.notificationModel.findByIdAndUpdate(notificationId, { read: true }).exec();
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }

  async deleteNotification(notificationData: { type: string; sender: string; post: string }): Promise<void> {
    try {
      // Find and delete the notification based on the provided data
      await this.notificationModel.deleteOne(notificationData).exec();
    } catch (error) {
      throw new Error('Failed to delete notification');
    }
}

}

