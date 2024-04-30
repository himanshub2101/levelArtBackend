// // import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
// // import { NotificationService } from '../services/notification.service';
// // import { AuthGuard } from 'src/auth/auth.guard';
// // import { Notification } from 'src/schemas/notification.schema';

// // @Controller('notifications')
// // export class NotificationController {
// //   constructor(private readonly notificationService: NotificationService) {}

// //   @UseGuards(AuthGuard) // Apply the AuthGuard to the profile endpoint
// //   @Post('create')
// //  async createNotifications(@Body() createNotificationDto: Notification): Promise<Notification> {
// //     const { postId, userId } = createNotificationDto; // Destructure postId and userId from createNotificationDto
// //     return await this.notificationService.createPostLikeNotification(postId, userId); // Pass postId and userId separately
// //   }

// //   @UseGuards(AuthGuard) // Apply the AuthGuard to the profile endpoint
// //   @Get()
// //   async findAllNotifications(): Promise<Notification[]> { // Return Promise<Notification[]>
// //     return await this.notificationService.findAll();
// //   }

// //   @UseGuards(AuthGuard) // Apply the AuthGuard to the profile endpoint
// //   @Get(':id')
// //   async findOneNotifications(@Param('id') id: string): Promise<Notification | null> { // Return Promise<Notification | null>
// //     return await this.notificationService.findOne(id);
// //   }
// // }
// import { Controller, Post, Get, Param, Delete, Body, UseGuards } from '@nestjs/common';
// import { NotificationService } from '../services/notification.service';
// import { Notification } from '../../schemas/notification.schema';
// import { AuthGuard } from 'src/auth/auth.guard';

// @Controller('notifications')
// export class NotificationController {
//   constructor(private readonly notificationService: NotificationService) {}

//   @UseGuards(AuthGuard)
//   @Post()
//   async createNotification(@Body() createNotificationDto: Notification): Promise<Notification> {
//     const { userId, message, postId } = createNotificationDto;
//     return await this.notificationService.createNotification(userId, message, postId);
//   }

//   @UseGuards(AuthGuard)

//   @Post('/like')
//   async createLikeNotificationForPostOwner(@Body() data: { likedPostOwnerId: string, likerId: string, postId: string }): Promise<Notification> {
//     const { likedPostOwnerId, likerId, postId } = data;
//     return await this.notificationService.createLikeNotificationForPostOwner(likedPostOwnerId, likerId, postId);
//   }

//     @UseGuards(AuthGuard)
//     @Get('/:userId')
//   async getNotificationsByUserId(@Param('userId') userId: string): Promise<Notification[]> {
//     return await this.notificationService.getNotificationsByUserId(userId);
//   }
//   @UseGuards(AuthGuard)

//   @Delete('/:notificationId')
//   async deleteNotification(@Param('notificationId') notificationId: string): Promise<boolean> {
//     return await this.notificationService.deleteNotification(notificationId);
//   }
// }
