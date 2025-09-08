import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Event } from './event.entity';
import { EventParticipant } from '../modelos/event-participant.modelo';
import { GroupMessage } from '../modelos/group-message.modelo';
import { PrivateMessage } from '../modelos/private-message.modelo';

import { Evento } from '@/domain/eventos/modelos/eventos.modelo';
import { UsuarioAppPublico } from '@/domain/autenticacao/modelos/usuarios-app-publico.modelo';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventRepository: Repository<Evento>,
    @InjectRepository(EventParticipant)
    private readonly eventParticipantRepository: Repository<EventParticipant>,
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(PrivateMessage)
    private readonly privateMessageRepository: Repository<PrivateMessage>,
    @InjectRepository(UsuarioAppPublico)
    private readonly userRepository: Repository<UsuarioAppPublico>
  ) {}

  async joinEvent(eventId: number, userId: number): Promise<void> {
    const participant = new EventParticipant();
    participant.event_id = eventId;
    participant.user_id = userId;
    await this.eventParticipantRepository.save(participant);
  }

  async getGroupMessages(eventId: number): Promise<GroupMessage[]> {
    return this.groupMessageRepository.find({
      where: { event_id: eventId },
      relations: ['user'],
      order: { created_at: 'ASC' },
    });
  }

  async saveGroupMessage(
    eventId: number,
    userId: number,
    content: string,
    contentType: 'text' | 'image'
  ): Promise<{ message: GroupMessage; firstMessage: boolean }> {
    let firstMessage = false;
    const participant = await this.eventParticipantRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    if (!participant) {
      const newParticipant = new EventParticipant();
      newParticipant.event_id = eventId;
      newParticipant.user_id = userId;
      await this.eventParticipantRepository.save(newParticipant);
      firstMessage = true;
    }

    const message = new GroupMessage();
    message.event_id = eventId;
    message.user_id = userId;
    message.content = content;
    message.content_type = contentType;

    console.log('message', message);
    console.log('firstMessage', firstMessage);
    const savedMessage = await this.groupMessageRepository.save(message);
    return { message: savedMessage, firstMessage };
  }

  async getPrivateMessages(
    senderId: number,
    receiverId: number
  ): Promise<PrivateMessage[]> {
    return this.privateMessageRepository.find({
      where: [
        { sender_id: senderId, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: senderId },
      ],
      relations: ['sender', 'receiver'],
      order: { created_at: 'ASC' },
    });
  }

  async savePrivateMessage(
    senderId: number,
    receiverId: number,
    content: string,
    contentType: 'text' | 'image'
  ): Promise<PrivateMessage> {
    const message = new PrivateMessage();
    message.sender_id = senderId;
    message.receiver_id = receiverId;
    message.content = content;
    message.content_type = contentType;
    return this.privateMessageRepository.save(message);
  }

  async getEventParticipants(eventId: number): Promise<UsuarioAppPublico[]> {
    const participants = await this.eventParticipantRepository.find({
      where: { event_id: eventId },
      relations: ['user'],
    });
    return participants.map((p) => p.user);
  }
}
