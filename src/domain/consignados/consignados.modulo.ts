import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConsignadosControlador } from './controladores/consignados.controlador';
import { ConsignadosListRepositorioImpl } from './repositorios/consignadosList.repositorio';
import { ConsignadosAddUpdateRepositorioImpl } from './repositorios/consignados-addupdate.repositorio';
import { Consignado } from './modelos/consignado.modelo';
import { ConsignadoAddUpdateModelo } from './modelos/consignado-addupdate.modelo';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Consignado, ConsignadoAddUpdateModelo])],
  controllers: [ConsignadosControlador],
  providers: [
    {
      provide: 'ConsignadosListRepositorio',
      useFactory: (repository: Repository<Consignado>) => {
        return new ConsignadosListRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(Consignado)],
    },
    {
      provide: 'ConsignadosAddUpdateRepositorio',
      useFactory: (repository: Repository<ConsignadoAddUpdateModelo>) => {
        return new ConsignadosAddUpdateRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(Consignado)],
    },
  ],
  exports: ['ConsignadosListRepositorio', 'ConsignadosAddUpdateRepositorio'],
})
export class ConsignadoModulo {}
