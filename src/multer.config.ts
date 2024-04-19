import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerConfig: MulterModuleOptions = {
  dest: './uploads', // Destination folder where uploaded files will be stored
};
