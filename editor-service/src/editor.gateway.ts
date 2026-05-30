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
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { PrismaService } from './prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EditorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        console.log('Token não enviado');
        client.disconnect();
        return;
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET as string);

      client.data.user = payload;

      console.log(`Usuário autenticado: ${(payload as any).email}`);
    } catch (error) {
      console.log('JWT inválido');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado ${client.id}`);
  }

  @SubscribeMessage('join-document')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { docId: string },
  ) {
    client.join(data.docId);

    console.log(`${client.data.user.email} entrou no documento ${data.docId}`);

    const document = await this.prisma.document.findUnique({
      where: { id: data.docId },
    });

    if (document) {
      client.emit('load-document', document.content);

      console.log(`doc init enviado para o cliente ${client.id}`);
    }
  }

  @SubscribeMessage('edit-content')
  async handleEdit(
    @MessageBody()
    data: {
      docId: string;
      content: string;
    },
  ) {
    console.log('Recebido:', data);

    const document = await this.prisma.document.upsert({
      where: { id: data.docId },
      update: {
        content: data.content,
      },
      create: {
        id: data.docId,
        content: data.content,
        title: 'Documento Colaborativo',
      },
    });

    this.server.to(data.docId).emit('content-updated', document);
  }
}
