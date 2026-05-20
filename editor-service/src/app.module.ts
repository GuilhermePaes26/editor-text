/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EditorGateway } from './editor.gateway';
import { PrismaService } from './prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices'; // Importe os módulos de microserviços a
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth-service',
          port: 3002,
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, EditorGateway, PrismaService],
})
export class AppModule {}
