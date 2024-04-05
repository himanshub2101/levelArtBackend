// import { Injectable, NotFoundException } from '@nestjs/common';
// import { UserService } from '../../users/services/user.services';
// import { User } from 'src/schemas/user.schema';

// @Injectable()
// export class FollowService {
//   constructor(private userService: UserService) {}

//   async follow(userId: string, followerId: string): Promise<void> {
//     const user = await this.userService.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Check if the follower is already following the user
//     if (!user.followers.includes(followerId)) {
//       user.followers.push(followerId);
//       await user.save();
//     }
//   }

//   async getFollowings(userId: string): Promise<User[]> {
//     const user = await this.userService.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     const followings = await this.userService.findManyByIds(user.followings);
//     return followings;
//   }

//   async getFollowers(userId: string): Promise<User[]> {
//     const user = await this.userService.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     const followers = await this.userService.findManyByIds(user.followers);
//     return followers;
//   }

//   async calculateFollowersCount(userId: string): Promise<number> {
//     const user = await this.userService.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     return user.followers.length;
//   }

//   async calculateFollowingsCount(userId: string): Promise<number> {
//     const user = await this.userService.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     return user.followings.length;
//   }
// }

import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowersService {
  private followersMap: Map<string, Set<string>> = new Map();
  private followingMap: Map<string, Set<string>> = new Map();

  async followUser(userId: string, followedUserId: string): Promise<void> {
    // 1. Add user A to the list of followers of user B
    let followersSet = this.followersMap.get(followedUserId);
    if (!followersSet) {
      followersSet = new Set();
      this.followersMap.set(followedUserId, followersSet);
    }
    followersSet.add(userId);
  
    // 2. Increase the count of followers for user B
    let followingSet = this.followingMap.get(userId);
    if (!followingSet) {
      followingSet = new Set();
      this.followingMap.set(userId, followingSet);
    }
    followingSet.add(followedUserId);
  }
  
  async unfollowUser(userId: string, unfollowedUserId: string): Promise<void> {
    const followers = this.followersMap.get(unfollowedUserId);
    const following = this.followingMap.get(userId);

    if (followers && following) {
      followers.delete(userId);
      following.delete(unfollowedUserId);
    }
  }

  async getFollowers(userId: string): Promise<string[]> {
    const followers = this.followersMap.get(userId);
    return followers ? Array.from(followers) : [];
  }

  async getFollowing(userId: string): Promise<string[]> {
    const following = this.followingMap.get(userId);
    return following ? Array.from(following) : [];
  }
}

