// create-post.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  text: string;

  @IsOptional()
  @IsUrl()
  image?: string; // Assuming the image is optional and should be a URL

}
