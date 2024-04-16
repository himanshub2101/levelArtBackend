import { Controller, Post, Body, Req, Res, NotFoundException, InternalServerErrorException, Get, Param, UnauthorizedException, Delete, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/users/services/user.services';
import { PostService } from '../services/posts.services';
import { cloudinary } from '../../cloudinary/cloudinary.config'; 
import { Posts } from 'src/schemas/posts.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import * as jwt from 'jsonwebtoken'; // Import JWT library



@Controller('posts')
export class PostController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}
  private extractUserIdFromToken(token: string): string {
  // Check if the token starts with "Bearer " and remove it if present
  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

  // Decode the JWT token to extract user ID
  const decodedToken = jwt.decode(tokenWithoutBearer);
  if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.hasOwnProperty('sub')) {
    throw new Error('Invalid JWT token');
  }

  return decodedToken.sub; // Assuming the user ID is stored in the 'sub' property
}

@UseGuards(AuthGuard)
@Post('create-post')
async createPost(@Body() body: any, @Req() req: Request, @Res() res: Response) {
  try {
    console.log('Request Body:', body);
    const { postedBy, text } = body;
    let { img } = body;

    console.log('postedBy:', postedBy);
    console.log('text:', text);

    if (!postedBy || !text) {
      console.log('Missing required fields');
      return res.status(400).json({ error: "Postedby and text fields are required" });
    }

    console.log('Checking authentication...');
    console.log('Request Headers:', req.headers);

    const authToken = req.headers.authorization;
    if (!authToken) {
      console.log('No authentication token provided');
      return res.status(401).json({ error: "Unauthorized: No authentication token provided" });
    }

    const userId = this.extractUserIdFromToken(authToken);
    console.log('Authenticated User ID:', userId);

    const user = await this.userService.findById(postedBy);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure that the userId extracted from the token matches the user._id from the database
    if (user._id.toString() !== userId) {
      console.log('Unauthorized to create post');
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      console.log('Text exceeds maximum length');
      return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
    }

    if (img) {
      console.log('Uploading image...');
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
      console.log('Image uploaded:', img);
    }

    console.log('Creating new post...');
    const newPost = await this.postService.create({ postedBy, text, img });
    console.log('New post created:', newPost);

    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
  
  @UseGuards(AuthGuard)
  @Get('get/:id')
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

  @UseGuards(AuthGuard)
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
  
  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get()
  @UseGuards(AuthGuard)
  async getFeedPosts(@Req() req: Request, @Res() res: Response) {
    try {
      // Ensure that user information is available in the request
      if (!req.hasOwnProperty('user')) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      // Extract the user ID from the request
      const user = req['user'];
      console.log('User:', user);
  
      const userId = user.sub;
      console.log('User ID:', userId);
  
      // Check if the user ID is valid
      if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      // Fetch feed posts for the user
      const feedPosts = await this.postService.getFeedPosts(userId);

      console.log("feedPosts:",feedPosts)
      res.status(200).json(feedPosts);
    } catch (err) {
      // Handle any errors that occur during the process
      res.status(500).json({ error: err.message });
    }
  }
      

  @UseGuards(AuthGuard)
  @Get('user/:id')
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
