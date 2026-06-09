import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
@Injectable()
export default class AppConfig {
  constructor(private configService: ConfigService) {}

  private get validatedEnv() {
    return process.env;
  }

  get nodeEnv() {
    return this.validatedEnv.NODE_ENV as 'development' | 'production';
  }

  get COOKIE_MAX_AGE1(): number {
    return Number(this.validatedEnv.COOKIE_MAX_AGE1);
  }
  get DATABASE_URL(): string {
    return this.validatedEnv.DATABASE_URL as string;
  }

  get jwtSecret(): string {
    return this.validatedEnv.JWT_SECRET_KEY as string;
  }

  get jwtExpiresIn(): string {
    return this.validatedEnv.JWT_EXPIRES_IN as string;
  }
}
