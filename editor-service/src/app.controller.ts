/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('auth')
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() data: any) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'register' }, data),
    );
  }
  @Post('login')
  login(@Body() data: any) {
    return this.authClient.send({ cmd: 'login' }, data);
  }

  //teste de rota protegida
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }
}
