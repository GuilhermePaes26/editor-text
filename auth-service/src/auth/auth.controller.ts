/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  async register(data: any) {
    return await this.authService.register(data);
  }

  @MessagePattern({ cmd: 'validateUser' })
  async validateUser(data: { email: string; password: string }) {
    return await this.authService.validateUser(data.email, data.password);
  }
}
