import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosControlador } from './controladores/eventos.controlador';
import { EventosRepositorioImpl } from './repositorios/eventos.repositorio';
import { EventoAbertosRespostaDto } from './dtos/eventosAbertos-resposta.dto';

@Module({
  imports: [TypeOrmModule.forFeature([EventoAbertosRespostaDto])],
  controllers: [EventosControlador],
  providers: [
    {
      provide: 'EventosRepositorio',
      useClass: EventosRepositorioImpl,
    },
  ],
})
export class EventosModulo {}
