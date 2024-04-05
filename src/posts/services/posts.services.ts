// post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostDocument } from '../../schemas/posts.schema';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb'; // Import ObjectId from 'mongodb'
import { User } from 'src/schemas/user.schema';



@Injectable()
export class PostService {
  constructor(@InjectModel(Posts.name) private readonly postModel: Model<PostDocument>,
  @InjectModel(User.name)private userModel: Model<User>  
  ) {}

  async create(postData: any): Promise<Posts> {
    const newPost = new this.postModel(postData);
    return await newPost.save();
  }

  async findById(id: string): Promise<Posts | null> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async delete(id: string): Promise<void> {
    await this.postModel.findByIdAndDelete(id).exec();
  }

  async likeUnlikePost(postId: string, userId: string): Promise<void> {
    const objectIdPostId = new Types.ObjectId(postId); 
    const objectIdUserId = new Types.ObjectId(userId); 

    const post = await this.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const userLikedPost = post.likes.includes(objectIdUserId);

    if (userLikedPost) {
      // Unlike post
      await this.postModel.updateOne({ _id: objectIdPostId }, { $pull: { likes: objectIdUserId } }).exec();
    } else {
      // Like post
      post.likes.push(objectIdUserId);
      await post.save();
    }
  }

  async replyToPost(postId: string, userId: string, text: string, userProfilePic: string, username: string): Promise<any> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }   

    const objectIdUserId = new ObjectId(userId); // Convert userId to ObjectId
    const reply = { userId: objectIdUserId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    return reply;
  }

  async getFeedPosts(userId: string): Promise<Posts[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const following = user.followings;
    return this.postModel.find({ postedBy: { $in: following } }).sort({ createdAt: -1 }).exec();
  }
}
