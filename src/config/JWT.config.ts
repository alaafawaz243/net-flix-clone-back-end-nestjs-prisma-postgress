import { JwtModuleOptions } from '@nestjs/jwt';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET_KEY,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN as any,
    },
  }),
);
