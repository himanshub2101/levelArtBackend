// search.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async searchByUsername(username: string) {
    try {
      // Perform a case-insensitive search for users whose usernames contain the provided query string
      const users = await this.userModel.find({ username: { $regex: username, $options: 'i' } });

      return users;
    } catch (error) {
      throw new Error(`Error searching for users: ${error.message}`);
    }
  }
}
