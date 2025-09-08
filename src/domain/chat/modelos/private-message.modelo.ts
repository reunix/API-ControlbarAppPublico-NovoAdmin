import { UsuarioAppPublico } from '@/domain/autenticacao/modelos/usuarios-app-publico.modelo';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// import { ResponseUsuarioAppPublicoDto } from './response-usuarios-app-publico.dto';

@Entity('private_messages')
export class PrivateMessage {
  @PrimaryGeneratedColumn()
  message_id: number;

  @Column()
  sender_id: number;

  @Column()
  receiver_id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: ['text', 'image'] })
  content_type: 'text' | 'image';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => UsuarioAppPublico)
  @JoinColumn({ name: 'sender_id' })
  sender: UsuarioAppPublico;

  @ManyToOne(() => UsuarioAppPublico)
  @JoinColumn({ name: 'receiver_id' })
  receiver: UsuarioAppPublico;
}
