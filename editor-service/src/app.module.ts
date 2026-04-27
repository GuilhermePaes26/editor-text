import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EditorGateway } from './editor.gateway';
import { PrismaService } from './prisma/prisma.service';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EditorGateway, PrismaService],
})
export class AppModule {}
