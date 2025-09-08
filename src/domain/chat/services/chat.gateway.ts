import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinEvent')
  async handleJoinEvent(
    client: Socket,
    payload: { eventId: number; userId: number }
  ) {
    await this.chatService.joinEvent(payload.eventId, payload.userId);
    void client.join(`event:${payload.eventId}`);
    const messages = await this.chatService.getGroupMessages(payload.eventId);
    client.emit('groupMessages', messages);
  }

  @SubscribeMessage('sendGroupMessage')
  async handleGroupMessage(
    client: Socket,
    payload: {
      eventId: number;
      userId: number;
      content: string;
      contentType: 'text' | 'image';
    }
  ) {
    const { message, firstMessage } = await this.chatService.saveGroupMessage(
      payload.eventId,
      payload.userId,
      payload.content,
      payload.contentType
    );
    this.server.to(`event:${payload.eventId}`).emit('groupMessage', message);

    if (firstMessage) {
      console.log('emitir firstmessage');
      client.emit('firstMessage', { messageId: message.message_id });
    }
  }

  @SubscribeMessage('joinPrivateChat')
  async handleJoinPrivateChat(
    client: Socket,
    payload: { senderId: number; receiverId: number }
  ) {
    const roomId = [payload.senderId, payload.receiverId].sort().join(':');
    void client.join(`private:${roomId}`);
    const messages = await this.chatService.getPrivateMessages(
      payload.senderId,
      payload.receiverId
    );
    client.emit('privateMessages', messages);
  }

  @SubscribeMessage('sendPrivateMessage')
  async handlePrivateMessage(
    client: Socket,
    payload: {
      senderId: number;
      receiverId: number;
      content: string;
      contentType: 'text' | 'image';
    }
  ) {
    const message = await this.chatService.savePrivateMessage(
      payload.senderId,
      payload.receiverId,
      payload.content,
      payload.contentType
    );
    const roomId = [payload.senderId, payload.receiverId].sort().join(':');
    this.server.to(`private:${roomId}`).emit('privateMessage', message);
  }
}
