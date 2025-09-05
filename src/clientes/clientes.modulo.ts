import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesControlador } from './controladores/clientes.controlador';
import { ClientesRepositorioImpl } from './repositorios/clientes.repositorio';
import { Cliente } from './modelos/cliente.modelo';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesControlador],
  providers: [
    {
      provide: 'ClientesRepositorio',
      useClass: ClientesRepositorioImpl,
    },
  ],
})
export class ClientesModulo {}
