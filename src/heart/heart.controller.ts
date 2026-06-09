import { Controller, Post, Req, Get, Query, Body } from '@nestjs/common';
import { CreateHeartDto } from './dto/CreateHeart.dto';
import CurseDto from '../validators/curse.dto';
import { HeartService } from './heart.service';

@Controller('heart')
export class HeartController {
  constructor(private readonly heartService: HeartService) {}

  @Get()
  getAllSaved(@Query() query: CurseDto, @Req() req: any) {
    return this.heartService.gethHeart(query, req.user.userId);
  }

  @Post()
  toggleSaved(@Body() dataHeartDto: CreateHeartDto, @Req() req: any) {
    return this.heartService.toggleHeart(dataHeartDto, req.user.userId);
  }
}
