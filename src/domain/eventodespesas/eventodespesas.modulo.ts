import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EventoDespesasControlador } from './controladores/eventodespesas.controlador';
//import { EventoDespesasListRepositorioImpl } from './repositorios/eventoDespesasList.repositorio';
import { EventoDespesasListRepositorioImpl } from './repositorios/eventodespesas-list.repositorio'; // Corrigido o nome do arquivo

import { EventoDespesasCrudRepositorioImpl } from './repositorios/eventodespesas-crud.repositorio';
// import { EventoDepesas } from './modelos/eventodespesas.modelo';
import { EventoDespesaAddUpdateModelo } from './modelos/eventodespesas-addupdate.modelo';
import { Repository } from 'typeorm';
import { EventoDespesasListRespostaDto } from './dtos/eventodespesasList-resposta.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventoDespesasListRespostaDto,
      EventoDespesaAddUpdateModelo,
    ]),
  ],
  controllers: [EventoDespesasControlador],
  providers: [
    {
      provide: 'EventoDespesasListRepositorio',
      useFactory: (repository: Repository<EventoDespesasListRespostaDto>) => {
        return new EventoDespesasListRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(EventoDespesasListRespostaDto)],
    },
    {
      provide: 'EventoDespesasCrudRepositorio',
      useFactory: (repository: Repository<EventoDespesaAddUpdateModelo>) => {
        return new EventoDespesasCrudRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(EventoDespesaAddUpdateModelo)],
    },
  ],
  exports: ['EventoDespesasListRepositorio', 'EventoDespesasCrudRepositorio'],
})
export class EventoDespesasModulo {}
