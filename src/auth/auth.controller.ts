import { Controller, Post, Body, Req, Res, Get, Patch } from '@nestjs/common';
import { ChangePasswordDto } from '../validators/changePassword.dto';
import AuthDecorator from '../decorator/auth.decorator';
import SignUpAuthDto from './dto/sign-up-auth.dto';
import SignInAuthDto from './dto/sign-in-auth.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AuthDecorator()
  @Post('signup')
  async signUp(
    @Body() signUpAuthDto: SignUpAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signUp(signUpAuthDto, res);
  }

  @AuthDecorator()
  @Post('login')
  async login(
    @Body() signInAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(signInAuthDto, res);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req.user.userId, res);
  }

  @Patch('change-password')
  changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }

  @Get('me')
  async getMe(@Req() req: any) {
    return this.authService.getMe(req.user.userId);
  }
}
