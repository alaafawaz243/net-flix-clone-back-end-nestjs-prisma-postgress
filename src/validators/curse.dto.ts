import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export default class CurseDto {
  @IsOptional()
  @IsUUID()
  cursorId?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'limit must be an integer' })
  @Min(1)
  @Max(100)
  limit?: number;
}
