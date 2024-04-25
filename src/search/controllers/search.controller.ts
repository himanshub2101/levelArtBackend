// search.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/user')
  async searchUserByUsername(@Query('username') username: string) {
    try {
      const users = await this.searchService.searchByUsername(username);
      return { success: true, data: users };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
