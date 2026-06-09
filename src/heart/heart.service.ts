import { Injectable } from '@nestjs/common';
import { CreateHeartDto } from './dto/CreateHeart.dto';
import { PrismaService } from '../prisma.service';
import CurseDto from '../validators/curse.dto';
import { sendResponsive } from '../utils';

@Injectable()
export class HeartService {
  constructor(private readonly prisma: PrismaService) {}

  async gethHeart(query: CurseDto, userId: string) {
    const { cursorId, limit = 9 } = query;

    const hearts = await this.prisma.heart.findMany({
      where: { userId },
      ...(cursorId && {
        cursor: { id: cursorId },
        skip: 1,
      }),
      take: limit,
      omit: { userId: true },
    });

    return sendResponsive(
      {
        meta: {
          cursorId: hearts[hearts.length - 1]?.id || null,
        },
        hearts,
      },
      'Get All heart Suuccessfully',
    );
  }

  async toggleHeart(dataHeartDto: CreateHeartDto, userId: string) {
    const { id: movieId, backdrop_path, title } = dataHeartDto;
    return this.prisma.$transaction(async (prisma) => {
      const existingHeart = await prisma.heart.findUnique({
        where: {
          userId_movieId: {
            userId,
            movieId,
          },
        },
      });

      const wasHeart = !!existingHeart;
      const isHeart = !wasHeart;

      if (wasHeart) {
        await prisma.heart.delete({
          where: {
            userId_movieId: {
              userId,
              movieId,
            },
          },
        });
      } else {
        if (!backdrop_path || !title)
          throw new Error('backdrop_path and title are required');
        await prisma.heart.create({
          data: { movieId, backdrop_path, title, userId },
        });
      }

      return sendResponsive(
        isHeart,
        `filme ${isHeart ? 'Heart' : 'un Heart'} successfully`,
      );
    });
  }
}
