import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/services/user.services';
import { JwtService } from '@nestjs/jwt';
import { successMessage } from 'src/utils/response.util';

@Injectable()
export class AuthServices {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string, // Changed parameter name to identifier
    pass: string,
  ): Promise<{ access_token: string , message: any}> {
    let user = await this.usersService.findOne(username); // Try to find user by username

    // If user is not found by username, try to find by email
    if (!user) {
      user = await this.usersService.findOneByEmail(username);
    }

    // If user is still not found, throw UnauthorizedException
    if (!user || user.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, username: user.username };
    return {
      message: successMessage.userLoggedIn,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
