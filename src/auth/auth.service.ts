import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ChangePasswordDto } from '../validators/changePassword.dto';
import SignUpAuthDto from './dto/sign-up-auth.dto';
import SignInAuthDto from './dto/sign-in-auth.dto';
import { PrismaService } from '../prisma.service';
import { CookieOptions, Response } from 'express';
import { RequestType } from '../types/type';
import AppConfig from '../config/app.config';
import { sendResponsive } from '../utils';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private config: AppConfig,
  ) {}

  secureCookieOptions = (): CookieOptions => {
    if (process.env.NODE_ENV === 'development') return {};
    return {
      httpOnly: true,
      secure: this.config.nodeEnv === 'production',
      sameSite: 'none',
      maxAge: this.config.COOKIE_MAX_AGE1,
    };
  };

  async signUp(signUpAuthDto: SignUpAuthDto, res: Response) {
    const { email } = signUpAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new BadRequestException('Email already in use');

    return await this.prisma.$transaction(async (prisma) => {
      const hashedPassword = await hash(signUpAuthDto.password, 10);
      const user = await prisma.user.create({
        data: { ...signUpAuthDto, password: hashedPassword },
      });

      const userId = user.id;
      const payload: RequestType = {
        userId,
      };

      const accessToken = await this.JWTSign(payload);
      res.cookie('accessToken', accessToken, this.secureCookieOptions());
      return sendResponsive(
        {
          user: { id: userId },
        },
        'Logged in successfully',
      );
    });
  }

  async login(signInAuthDto: SignInAuthDto, res: Response) {
    const { email, password } = signInAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLocaleLowerCase() },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const hearts = await this.prisma.heart.findMany({
      where: { userId: user.id },
      select: {
        movieId: true,
      },
    });

    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    let { id: userId } = user;

    const payload: RequestType = {
      userId,
    };

    const accessToken = await this.JWTSign(payload);

    const refreshToken = await this.JWTSign(payload, true);

    const hashRefreshToken = await hash(refreshToken, 12);

    res.cookie('accessToken', accessToken, this.secureCookieOptions());
    return sendResponsive(
      {
        user: { id: userId },
        hearts: hearts.map((h) => +h.movieId),
      },
      'Logged in successfully',
    );
  }

  async logout(userId: string, res: Response) {
    res.clearCookie('accessToken');
    return sendResponsive(null, 'Logged out successfully');
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;
    if (oldPassword === newPassword)
      throw new BadRequestException('Invalid credentials');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Invalid credentials');

    const isMatch = await compare(oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const hashedPassword = await hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return sendResponsive(null, 'Password updated successfully');
  }

  async getMe(userId: string) {
    const [user, hearts] = await Promise.all([
      await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
        },
      }),
      await this.prisma.heart.findMany({
        where: { userId },
        select: {
          movieId: true,
        },
      }),
    ]);

    if (!user) throw new BadRequestException('User not found');

    return sendResponsive(
      { user, hearts: hearts.map((h) => +h.movieId) },
      'User data successfully',
    );
  }

  async JWTSign(payload: RequestType, refresh: boolean = false) {
    return await this.jwtService.signAsync(payload);
  }
}
