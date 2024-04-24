import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'; // Import cors middleware
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging

  // Enable CORS for all routes
  app.use(cors({
    origin: '*', // Allow requests from all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific HTTP methods
    // allowedHeaders: ['Authorization', 'Content-Type'], // Allow specific headers
  }));

  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
