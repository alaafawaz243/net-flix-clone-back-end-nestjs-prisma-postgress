import BaseDataUserDto from '../../validators/baseDataUser.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(
  OmitType(BaseDataUserDto, ['password', 'email']),
) {}
