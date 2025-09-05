import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoControlador } from './controladores/autenticacao.controlador';
import { AutenticacaoRepositorioImpl } from './repositorios/autenticacao.repositorio';
import { Usuario } from './modelos/usuario.modelo';
import { UsuarioAppPublio } from './modelos/usuario-app-publico.modelo';
import { Repository } from 'typeorm';
import { AutenticacaoAppPublicoRepositorioImpl } from './repositorios/autenticacao-app-publico.repositorio';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, UsuarioAppPublio])],
  controllers: [AutenticacaoControlador],

  providers: [
    {
      provide: 'AutenticacaoRepositorio',
      useFactory: (repository: Repository<Usuario>) => {
        return new AutenticacaoRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(Usuario)],
    },
    {
      provide: 'AutenticacaoAppPublicoRepositorio',
      useFactory: (repository: Repository<UsuarioAppPublio>) => {
        return new AutenticacaoAppPublicoRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(UsuarioAppPublio)],
    },
  ],
  exports: ['AutenticacaoRepositorio', 'AutenticacaoAppPublicoRepositorio'],
})
export class AutenticacaoModulo {}
