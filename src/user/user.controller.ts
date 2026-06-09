import {
  Controller,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch(':userId')
  updateUserTeacher(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    if (req.user?.userId !== userId)
      throw new BadRequestException('something wrong');

    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseUUIDPipe) userId: string, @Req() req: any) {
    if (req.user.userId !== userId)
      throw new BadRequestException('You can not delete other user');
    return this.usersService.deleteUser(req.user.userId);
  }
}
