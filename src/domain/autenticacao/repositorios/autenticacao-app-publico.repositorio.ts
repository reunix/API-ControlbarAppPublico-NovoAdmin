import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAppPublicoRespostaDto } from 'domain/autenticacao/dtos/login-app-publico-resposta.dto';
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
  ): Promise<LoginAppPublicoRespostaDto> {
    try {
      const usuario = await this.repositorioUserAppPublico.findOne({
        where: { usersweb_cpf: cpf },
      });

      console.log('usuario', usuario);

      if (!usuario || !usuario.usersweb_senha) {
        return {
          success: false,
          message: 'Usuário não encontrado ou senha não definida',
        };
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        senha,
        usuario.usersweb_senha
      );

      return {
        success: isPasswordValid,
        message: isPasswordValid
          ? 'Logado com sucesso'
          : 'CPF ou senha incorretos. Tente novamente.',
      };
    } catch (error) {
      console.log('error: ', error);
      return {
        success: false,
        message: `Erro ao buscar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
  }
}
