import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/services/user.services";
import { successMessage } from "src/utils/response.util";

@Injectable()
export class AuthServices {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string, message: any }> {
    try {
      let user = await this.usersService.findOneById(username);

      if (!user) {
        user = await this.usersService.findOneByEmail(username);
      }

      if (!user || user.password !== pass) {
        throw new UnauthorizedException();
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
