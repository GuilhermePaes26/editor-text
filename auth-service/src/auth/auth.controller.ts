/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Controller } from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() data: any) {
    return await this.authService.register(data);
  }

  @MessagePattern({ cmd: 'validateUser' })
  async validateUser(
    @Payload()
    data: {
      email: string;
      password: string;
    },
  ) {
    return await this.authService.validateUser(data.email, data.password);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: LoginDto) {
    return await this.authService.login(data);
  }
}
