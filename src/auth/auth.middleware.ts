import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/users/services/user.services';
import * as jwt from 'jsonwebtoken'; // Import JWT library

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Check if authentication token or session is present in the request headers
    const authToken = req.headers.authorization;
    if (!authToken) {
      return res.status(401).json({ error: 'Unauthorized: No authentication token provided' });
    }

    try {
      // Extract user ID from the authentication token (JWT)
      const userId = this.extractUserIdFromToken(authToken);

      // Retrieve user data based on the user ID
      const user = await this.userService.findOneById(userId);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid user ID' });
      }

      // Attach user data to the request object
      req['user'] = user;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: Invalid authentication token' });
    }
  }

  private extractUserIdFromToken(token: string): string {
    // Extract the token from the "Bearer <token>" format
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new Error('Invalid authentication token format');
    }

    // Decode the JWT token to extract user ID
    const decodedToken = jwt.decode(tokenParts[1]);
    if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.hasOwnProperty('userId')) {
      throw new Error('Invalid JWT token');
    }

    return decodedToken.userId; // Assuming the user ID is stored in the token
  }
}
