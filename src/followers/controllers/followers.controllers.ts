// import { Controller, Get, Post, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
// import { FollowersService } from '../services/followers.services';

// @Controller('followers')
// export class FollowersController {
//   constructor(private readonly followersService: FollowersService) {}

//   @Post('follow/:userId')
//   async followUser(@Param('userId') userId: string, @Param('followedUserId') followedUserId: string): Promise<{ message: string }> {
//     try {
//       // Log the user IDs
//       console.log('User ID:', userId);
//       console.log('Followed User ID:', followedUserId);
  
//       // Call the followUser method from the service
//       await this.followersService.followUser(userId, followedUserId);
      
//       // Return success message
//       return { message: 'You are now following this user.' };
//     } catch (error) {
//       // Catch any errors and throw an HTTP exception with the error message
//       throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
//     }
//   }
  

//   @Delete('unfollow/:userId')
//   async unfollowUser(@Param('userId') userId: string, unfollowedUserId: string): Promise<void> {
//     await this.followersService.unfollowUser(userId, unfollowedUserId);
//   }

//   @Get('followers/:userId')
//   async getFollowers(@Param('userId') userId: string): Promise<string[]> {
//     return this.followersService.getFollowers(userId);
//   }

//   @Get('following/:userId')
//   async getFollowing(@Param('userId') userId: string): Promise<string[]> {
//     return this.followersService.getFollowing(userId);
//   }
// }

import { Controller, Get, Post, Delete, Param, HttpException, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { FollowersService } from '../services/followers.services';
import { User, userModel } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService,
    
  ) {}
  @UseGuards(AuthGuard)
  @Post('follow/:userId')


  async followUser(@Body() user:User, @Param('userId') userId: string, @Body('followedUserId') followedUserId: string): Promise<{ message: string }> {
    try {
      // Log the user IDs
      console.log('User ID:', userId);
      console.log('Followed User ID:', followedUserId);
  
      // Call the followUser method from the service
      await this.followersService.followUser(userId, followedUserId);
      
      // Return success message
      return { message: `You are now following this user. ${user.username}` };
    } catch (error) {
      // Catch any errors and throw an HTTP exception with the error message
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':userId/unfollow')
  async unfollowUser(@Param('userId') userId: string,@Body("followedUserId") followedUserId:string): Promise<{ message: string }> {
    console.log("userid:",userId)
    console.log("followedUserId:",followedUserId)
    try {
      await this.followersService.unfollowUser(userId,followedUserId);
 
      return { message: 'You have unfollowed this user.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string): Promise<string[]> {
    const userFollowers=await this.followersService.getFollowers(userId);
console.log("userFollowers:",userFollowers)
    return userFollowers
  }

  @UseGuards(AuthGuard)
  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string): Promise<string[]> {
    return this.followersService.getFollowing(userId);
  }
}

