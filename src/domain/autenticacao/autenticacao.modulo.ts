import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoControlador } from './controladores/autenticacao.controlador';
import { AutenticacaoRepositorioImpl } from './repositorios/autenticacao.repositorio';
import { UsuarioAdmin } from './modelos/usuario-admin.modelo';
import { Repository } from 'typeorm';
import { AutenticacaoAppPublicoRepositorioImpl } from './repositorios/autenticacao-app-publico.repositorio';
import { EmailService } from 'services/email-code-change-password.service';
import { AutenticacaoUpdateUserAppPublicoRepositorioImpl } from './repositorios/autenticacao-update-user-app-publico.repositorio';
// import { UpdateUsuarioAppPublio } from './modelos/update-usuario-app-publico.modelo';
import { UsuarioAppPublico } from './modelos/usuarios-app-publico.modelo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioAdmin,
      // UpdateUsuarioAppPublio,
      UsuarioAppPublico,
    ]),
  ],
  controllers: [AutenticacaoControlador],
  providers: [
    {
      provide: 'AutenticacaoRepositorio',
      useFactory: (repository: Repository<UsuarioAdmin>) => {
        return new AutenticacaoRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(UsuarioAdmin)],
    },
    {
      provide: 'AutenticacaoAppPublicoRepositorio',
      useFactory: (repository: Repository<UsuarioAppPublico>) => {
        return new AutenticacaoAppPublicoRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(UsuarioAppPublico)],
    },

    {
      provide: 'AutenticacaoUpdateUserAppPublicoRepositorio',
      useFactory: (repository: Repository<UsuarioAppPublico>) => {
        return new AutenticacaoUpdateUserAppPublicoRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(UsuarioAppPublico)],
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
