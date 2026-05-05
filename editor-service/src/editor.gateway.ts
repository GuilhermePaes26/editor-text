/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from './prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EditorGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly prisma: PrismaService) {}

  @SubscribeMessage('join-document')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() docId: string,
  ) {
    client.join(docId);
    console.log(`Cliente ${client.id} entrou no documento ${docId}`);

    const document = await this.prisma.document.findUnique({
      where: { id: docId },
    });
    if (document) {
      client.emit('load-document', document.content);
      console.log(`doc init enviado para o cliente ${client.id}`);
    }
  }

  @SubscribeMessage('edit-content')
  async handleEdit(@MessageBody() data: { docId: string; content: string }) {
    const document = await this.prisma.document.upsert({
      where: { id: data.docId },
      update: { content: data.content },
      create: {
        id: data.docId,
        content: data.content,
        title: 'Documento Colaborativo',
      },
    });

    this.server.to(data.docId).emit('content-updated', document);
  }
}
