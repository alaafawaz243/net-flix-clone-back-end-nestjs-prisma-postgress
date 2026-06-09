import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signAccessToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string, type: 'access' | 'refresh' = 'access') {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/v1',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
