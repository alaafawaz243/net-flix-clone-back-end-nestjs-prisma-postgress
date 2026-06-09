import { UpdateUserDto } from './dto/updateUser.dto';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { sendResponsive } from '../utils';

export const followOption = (userId?: string) =>
  userId && {
    following: {
      where: { OR: [{ followerId: userId }, { followingId: userId }] },
      select: {
        id: true,
      },
    },
  };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const data = Object.fromEntries(
      Object.entries(updateUserDto).filter(([_, value]) => value !== undefined),
    );

    await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true },
    });

    return sendResponsive(null, 'User updated successfully');
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    return sendResponsive(null, 'User deleted successfully');
  }
}
