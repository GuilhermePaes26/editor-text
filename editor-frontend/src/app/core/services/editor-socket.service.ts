import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class EditorSocketService {
  private socket!: Socket;
  connect(token: string, onConnect?: () => void) {
    this.socket = io('http://localhost:3001', {
      auth: {
        token,
      },
    });
    this.socket.on('connect', () => {
      console.log('SOCKET CONECTADO');

      onConnect?.();
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinDocument(docId: string) {
    this.socket.emit('join-document', { docId });
    console.log('EMIT JOIN', docId);
  }

  editContent(docId: string, content: string) {
    this.socket.emit('edit-content', { docId, content });
  }

  onLoadDocument(callback: (content: string) => void) {
    this.socket.on('load-document', callback);
  }

  onContentUpdated(callback: (document: any) => void) {
    this.socket.on('content-updated', callback);
  }
}
