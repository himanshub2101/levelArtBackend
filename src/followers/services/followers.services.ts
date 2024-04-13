// // import { Injectable, NotFoundException } from '@nestjs/common';
// // import { UserService } from '../../users/services/user.services';
// // import { User } from 'src/schemas/user.schema';

// // @Injectable()
// // export class FollowService {
// //   constructor(private userService: UserService) {}

// //   async follow(userId: string, followerId: string): Promise<void> {
// //     const user = await this.userService.findById(userId);
// //     if (!user) {
// //       throw new NotFoundException('User not found');
// //     }

// //     // Check if the follower is already following the user
// //     if (!user.followers.includes(followerId)) {
// //       user.followers.push(followerId);
// //       await user.save();
// //     }
// //   }

// //   async getFollowings(userId: string): Promise<User[]> {
// //     const user = await this.userService.findById(userId);
// //     if (!user) {
// //       throw new NotFoundException('User not found');
// //     }

// //     const followings = await this.userService.findManyByIds(user.followings);
// //     return followings;
// //   }

// //   async getFollowers(userId: string): Promise<User[]> {
// //     const user = await this.userService.findById(userId);
// //     if (!user) {
// //       throw new NotFoundException('User not found');
// //     }

// //     const followers = await this.userService.findManyByIds(user.followers);
// //     return followers;
// //   }

// //   async calculateFollowersCount(userId: string): Promise<number> {
// //     const user = await this.userService.findById(userId);
// //     if (!user) {
// //       throw new NotFoundException('User not found');
// //     }

// //     return user.followers.length;
// //   }

// //   async calculateFollowingsCount(userId: string): Promise<number> {
// //     const user = await this.userService.findById(userId);
// //     if (!user) {
// //       throw new NotFoundException('User not found');
// //     }

// //     return user.followings.length;
// //   }
// // }

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from 'src/schemas/user.schema';

// @Injectable()
// export class FollowersService {
//   private followersMap: Map<string, Set<string>> = new Map();
//   private followingMap: Map<string, Set<string>> = new Map();

//   constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

//   async followUser(userId: string, followedUserId: string): Promise<void> {
//     // Find the user who wants to follow
//     const user = await this.userModel.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Find the user being followed
//     const followedUser = await this.userModel.findById(followedUserId);
//     if (!followedUser) {
//       throw new NotFoundException('Followed user not found');
//     }

//     // Update the followings list of the user who initiated the follow action
//     if (!user.followings.includes(followedUserId)) {
//       user.followings.push(followedUserId);
//       await user.save();
//     }

//     // Update the followers list of the user who is being followed
//     if (!followedUser.followers.includes(userId)) {
//       followedUser.followers.push(userId);
//       await followedUser.save();
//     }
//   }
//   async unfollowUser(userId: string, unfollowedUserId: string): Promise<void> {
//     const followers = this.followersMap.get(unfollowedUserId);
//     const following = this.followingMap.get(userId);

//     if (followers && following) {
//       followers.delete(userId);
//       following.delete(unfollowedUserId);
//     }
//   }

//   async getFollowers(userId: string): Promise<string[]> {
//     const followers = this.followersMap.get(userId);
//     return followers ? Array.from(followers) : [];
//   }

//   async getFollowing(userId: string): Promise<string[]> {
//     const following = this.followingMap.get(userId);
//     return following ? Array.from(following) : [];
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class FollowersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async followUser(userId: string, followedUserId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    const followedUser = await this.userModel.findById(followedUserId);

    if (!user || !followedUser) {
      throw new NotFoundException('User not found');
    }

    if (!user.followings.includes(followedUserId)) {
      user.followings.push(followedUserId);
      await user.save();
    }

    if (!followedUser.followers.includes(userId)) {
      followedUser.followers.push(userId);
      await followedUser.save();
    }
  }

  async unfollowUser(userId: string, unfollowedUserId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    const unfollowedUser = await this.userModel.findById(unfollowedUserId);

    if (!user || !unfollowedUser) {
      throw new NotFoundException('User not found');
    }

    user.followings = user.followings.filter(id => id !== unfollowedUserId);
    unfollowedUser.followers = unfollowedUser.followers.filter(id => id !== userId);

    await user.save();
    await unfollowedUser.save();
  }

  async getFollowers(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.followers;
  }

  async getFollowing(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.followings;
  }
}
