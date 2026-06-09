import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Trim } from '../../validators/is-in-set.validator';

export class CreateHeartDto {
  @Trim()
  @IsNotEmpty()
  @Type(() => String)
  @IsString({ message: 'must be a valid string' })
  id!: string;

  @IsOptional()
  @Trim()
  @IsNotEmpty()
  @Matches(/^\/[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp)$/, {
    message:
      'backdrop_path must be a valid image path starting with "/" (e.g., /image.jpg)',
  })
  backdrop_path?: string;

  @IsOptional()
  @Trim()
  @IsNotEmpty()
  @IsString({ message: 'must be a valid string' })
  title?: string;
}
