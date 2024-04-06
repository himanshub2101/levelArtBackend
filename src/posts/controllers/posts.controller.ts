import { Controller, Post, Body, Req, Res, NotFoundException, InternalServerErrorException, Get, Param, UnauthorizedException, Delete, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/users/services/user.services';
import { PostService } from '../services/posts.services';
import { cloudinary } from '../../cloudinary/cloudinary.config'; 
import { Posts } from 'src/schemas/posts.schema';
import { AuthGuard } from 'src/auth/auth.guard';



@Controller('posts')
export class PostController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Post()
  async createPost(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const { postedBy, text } = body;
      let { img } = body;

      if (!postedBy || !text) {
        return res.status(400).json({ error: "Postedby and text fields are required" });
      }

      const user = await this.userService.findById(postedBy);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user._id.toString() !== req['user']._id.toString()) {
        return res.status(401).json({ error: "Unauthorized to create post" });
      }

      const maxLength = 500;
      if (text.length > maxLength) {
        return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
      }

      if (img) {
        const uploadedResponse = await cloudinary.uploader.upload(img);
        img = uploadedResponse.secure_url;
      }

      const newPost = await this.postService.create({ postedBy, text, img });

      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.log(err);
    }
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<Posts> {
    try {
      return await this.postService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const post = await this.postService.findById(id);

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.postedBy.toString() !== req['user']._id.toString()) {
        throw new UnauthorizedException('Unauthorized to delete post');
      }

      if (post.img) {
        const imgId = post.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
      }

      await this.postService.delete(id);

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
  
  @Post(':id/replies')
  async replyToPost(
    @Param('id') postId: string,
    @Body('text') text: string,
    @Body('userId') userId: string, // Assuming userId is coming from authentication
    @Body('userProfilePic') userProfilePic: string, // Assuming userProfilePic is coming from authentication
    @Body('username') username: string, // Assuming username is coming from authentication
  ) {
    try {
      if (!text) {
        throw new NotFoundException('Text field is required');
      }

      const reply = await this.postService.replyToPost(postId, userId, text, userProfilePic, username);
      return reply;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async getFeedPosts(@Req() req: Request, @Res() res: Response) {
    try {
      const userId =  req['user']
      const feedPosts = await this.postService.getFeedPosts(userId);
      res.status(200).json(feedPosts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  @Get('user/:username')
  async getUserPosts(@Param('username') username: string) {
    try {
      // Find the user by username
      const user = await this.userService.findOneByUsername(username);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Find posts by the user ID
      const posts = await this.postService.findByUserId(user._id);
      return posts;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
