import { IsNotEmpty, IsNumberString, IsUUID } from 'class-validator';
import { Trim } from './is-in-set.validator';

export default class QueryDto {
  @Trim()
  @IsNotEmpty()
  @IsNumberString({}, { message: 'must be a valid number' })
  movieId!: string;

  @IsUUID()
  userId!: string;
}

export class QueryDtoPartial extends QueryDto {}
