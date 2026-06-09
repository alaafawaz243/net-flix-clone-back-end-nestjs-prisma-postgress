import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorator/auth.decorator';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.accessToken;

    if (!token) throw new UnauthorizedException('You are not logged in');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      req['user'] = {
        userId: payload.userId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Your session has expired. Please refresh your token',
      );
    }
  }
}
