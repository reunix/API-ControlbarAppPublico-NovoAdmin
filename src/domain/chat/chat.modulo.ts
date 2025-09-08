import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventParticipant } from './modelos/event-participant.modelo';
import { GroupMessage } from './modelos/group-message.modelo';
import { PrivateMessage } from './modelos/private-message.modelo';
import { ChatService } from './services/chat.service';
import { Evento } from '../eventos/modelos/eventos.modelo';
import { UsuarioAppPublico } from '../autenticacao/modelos/usuarios-app-publico.modelo';
import { ChatController } from './controladores/chat.controller';
import { ChatGateway } from './services/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Evento,
      EventParticipant,
      GroupMessage,
      PrivateMessage,
      UsuarioAppPublico,
    ]),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
