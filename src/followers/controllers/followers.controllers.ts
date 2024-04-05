import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { FollowersService } from '../services/followers.services';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post('follow/:userId')
  async followUser(@Param('userId') userId: string, followedUserId:string): Promise<void> {
    await this.followersService.followUser(userId,followedUserId);
  }

  @Delete('unfollow/:userId')
  async unfollowUser(@Param('userId') userId: string,unfollowedUserId: string): Promise<void> {
    await this.followersService.unfollowUser(userId,unfollowedUserId);
  }

  @Get('followers/:userId')
  async getFollowers(@Param('userId') userId: string): Promise<string[]> {
    return this.followersService.getFollowers(userId);
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId') userId: string): Promise<string[]> {
    return this.followersService.getFollowing(userId);
  }
}
