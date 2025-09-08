import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutenticacaoAppPublicoRepositorio } from '../interfaces/autenticacao-app-publico-repositorio.interface';
import { UsuarioAppPublico } from '../modelos/usuarios-app-publico.modelo';
import { UsuarioCrudAppPublicoDto } from '../dtos/crud-usuarios-app-publico.dto';

@Injectable()
export class AutenticacaoAppPublicoRepositorioImpl
  implements AutenticacaoAppPublicoRepositorio
{
  constructor(
    @InjectRepository(UsuarioAppPublico)
    private readonly repositorioUserAppPublico: Repository<UsuarioAppPublico>
  ) {}
  async buscarUsuarioAppPublicoEmail(
    email: string
  ): Promise<UsuarioCrudAppPublicoDto | null> {
    try {
      const usuario = await this.repositorioUserAppPublico.findOne({
        where: { usersweb_email: email },
      });

      return usuario || null;
    } catch (error) {
      console.error('Erro ao buscar usuário: ', error);
      throw error;
    }
  }

  async buscarUsuarioAppPublico(
    cpf: string,
    senha: string
  ): Promise<UsuarioCrudAppPublicoDto | null> {
    try {
      const usuario = await this.repositorioUserAppPublico.findOne({
        where: { usersweb_cpf: cpf },
      });

      if (!usuario || !usuario.usersweb_senha) {
        return null;
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        senha,
        usuario.usersweb_senha
      );

      if (!isPasswordValid) {
        return null;
      }

      return usuario;
    } catch (error) {
      console.log('error: ', error);
      return null;
    }
  }
}
