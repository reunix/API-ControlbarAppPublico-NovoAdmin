import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// import { Event } from './event.entity';
import { UsuarioAppPublico } from '@/domain/autenticacao/modelos/usuarios-app-publico.modelo';
import { Evento } from '../../eventos/modelos/eventos.modelo';

@Entity('group_messages')
export class GroupMessage {
  @PrimaryGeneratedColumn()
  message_id: number;

  @Column()
  event_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: ['text', 'image'] })
  content_type: 'text' | 'image';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'event_id' })
  event: Evento;

  @ManyToOne(() => UsuarioAppPublico)
  @JoinColumn({ name: 'user_id' })
  user: UsuarioAppPublico;
}
