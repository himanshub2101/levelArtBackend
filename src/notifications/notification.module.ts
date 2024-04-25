// notification.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { UserService } from 'src/users/services/user.services'; // Assuming UserService is provided in the UserModule
import { UserModule } from 'src/users/user.module'; // Assuming UserModule provides UserService
import { Notification, NotificationSchema } from 'src/schemas/notification.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
      UserModule, // Import the UserModule providing UserService
    ],
    controllers: [NotificationController],
    providers: [NotificationService], // Remove UserService from here
    exports: [NotificationService], // Export NotificationService for use in other modules
  })
  export class NotificationModule {}
  