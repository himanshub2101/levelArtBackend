import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'; // Import cors middleware

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all routes
  app.use(cors({
    origin: '*', // Allow requests from all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific HTTP methods
    // allowedHeaders: ['Authorization', 'Content-Type'], // Allow specific headers
  }));

  await app.listen(3000);
}
bootstrap();
