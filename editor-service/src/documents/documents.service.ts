import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.document.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  create(title: string) {
    return this.prisma.document.create({
      data: {
        title,
        content: '',
      },
    });
  }
}
