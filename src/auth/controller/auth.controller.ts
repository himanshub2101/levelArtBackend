import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../auth.guard'; // Remove this import
import { AuthServices } from '../services/auth.services';
import { User } from 'src/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthServices) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: User) {
    try {
      return this.authService.signIn(signInDto.email, signInDto.password);
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Login failed'); // Handle login failure appropriately
    }
  }

  // Remove the @UseGuards(AuthGuard) decorator from here

  @UseGuards(AuthGuard) // Apply the AuthGuard to the profile endpoint
  @Get('profile')
  getProfile(@Request() req) {
    try {
      return req.user;
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      throw new Error('Unable to retrieve user profile'); // Handle profile retrieval failure
    }
  }
}
