import { PrismaServiceModule } from './prisma.module';
import { HeartModule } from './heart/heart.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guard/authGuard';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { HomeController } from './homePage.controller';

@Module({
  controllers: [HomeController],
  imports: [
    PrismaServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    HeartModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
