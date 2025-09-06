import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserUpdateAppPublicoRepositorio } from '../interfaces/usuarios-update-app-publico-repositorio.interface';
import { UsuarioCrudAppPublicoDto } from '../dtos/crud-usuarios-app-publico.dto';
import { removeUndefined } from 'utils/';
import { LoginAppPublicoRespostaDto } from '../dtos/login-app-publico-resposta.dto';
import { UpdateUsuarioAppPublio } from '../modelos/update-usuario-app-publico.modelo';

@Injectable()
export class AutenticacaoUpdateUserAppPublicoRepositorioImpl
  implements UserUpdateAppPublicoRepositorio
{
  constructor(
    @InjectRepository(UpdateUsuarioAppPublio)
    private readonly repositorioUserAppPublico: Repository<UpdateUsuarioAppPublio>
  ) {}
  async atualizarUser(
    usuario: UsuarioCrudAppPublicoDto
  ): Promise<LoginAppPublicoRespostaDto> {
    try {
      const data = removeUndefined(usuario);

      await this.repositorioUserAppPublico.update(
        { usersweb_email: data.usersweb_email },
        data
      );

      return {
        success: true,
        message: 'Cadastro atualizado com sucesso',
      };
    } catch (error) {
      console.log('error: ', error);
      return {
        success: false,
        message: `Erro ao tentar atualizar cadastro`,
      };
    }
  }
}
