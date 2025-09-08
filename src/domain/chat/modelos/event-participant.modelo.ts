import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Evento } from '../../eventos/modelos/eventos.modelo';
// import { ResponseUsuarioAppPublicoDto } from './response-usuarios-app-publico.dto';
import { UsuarioAppPublico } from '@/domain/autenticacao/modelos/usuarios-app-publico.modelo';

@Entity('event_participants')
export class EventParticipant {
  @PrimaryColumn()
  event_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joined_at: Date;

  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'event_id' })
  event: Evento;

  @ManyToOne(() => UsuarioAppPublico)
  @JoinColumn({ name: 'user_id' })
  user: UsuarioAppPublico;
}
