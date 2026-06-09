import { HeartController } from './heart.controller';
import { HeartService } from './heart.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [HeartController],
  providers: [HeartService],
})
export class HeartModule {}
