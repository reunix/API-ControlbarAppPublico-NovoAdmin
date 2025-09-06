import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoControlador } from './controladores/autenticacao.controlador';
import { AutenticacaoRepositorioImpl } from './repositorios/autenticacao.repositorio';
import { Usuario } from './modelos/usuario.modelo';
import { UsuarioAppPublio } from './modelos/usuario-app-publico.modelo';
import { Repository } from 'typeorm';
import { AutenticacaoAppPublicoRepositorioImpl } from './repositorios/autenticacao-app-publico.repositorio';
import { EmailService } from 'services/email-code-change-password.service';
import { AutenticacaoUpdateUserAppPublicoRepositorioImpl } from './repositorios/autenticacao-update-user-app-publico.repositorio';
import { UpdateUsuarioAppPublio } from './modelos/update-usuario-app-publico.modelo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      UsuarioAppPublio,
      UpdateUsuarioAppPublio,
    ]),
  ],
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

    {
      provide: 'AutenticacaoUpdateUserAppPublicoRepositorio',
      useFactory: (repository: Repository<UpdateUsuarioAppPublio>) => {
        return new AutenticacaoUpdateUserAppPublicoRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(UpdateUsuarioAppPublio)],
    },
    EmailService,
  ],
  exports: [
    'AutenticacaoRepositorio',
    'AutenticacaoAppPublicoRepositorio',
    'AutenticacaoUpdateUserAppPublicoRepositorio',
    EmailService,
  ],
})
export class AutenticacaoModulo {}
