import { GlobalExceptionFilter } from './globalErrorHandler';
import { ValidationPipe } from '@nestjs/common';
import { WinstonConfig } from './utils/logger';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import morgan from 'morgan';
import { json } from 'express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonConfig,
  });
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(json());

  // const allowedOrigins = [process.env.CLIENT_URL];
  // app.enableCors({
  //   origin: (origin, callback) => {
  //     if (!origin || allowedOrigins.includes(origin)) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   credentials: true,
  // });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
