import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/services/user.services";
import { successMessage } from "src/utils/response.util";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServices {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, password: string): Promise<{ access_token: string, message: any }> {
    try {
      let user = null;

      // Check if the username is a valid ObjectId (for _id) or an email address
      if (username.match(/^[0-9a-fA-F]{24}$/)) {
        // If it's an ObjectId, search by _id
        user = await this.usersService.findOneById(username);
      } else {
        // If it's not an ObjectId, search by email
        user = await this.usersService.findOneByEmail(username);
      }

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user._id, username: user.email };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        message: successMessage.userLoggedIn,
        access_token
      };
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error during login:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
