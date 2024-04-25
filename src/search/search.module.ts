// search.module.ts

import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Provide UserModel
      ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
