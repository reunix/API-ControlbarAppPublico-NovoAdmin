import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAppPublicoRespostaDto } from 'autenticacao/dtos/login-app-publico-resposta.dto';

import { UsuarioAppPublio } from 'autenticacao/modelos/usuario-app-publico.modelo';
import { AutenticacaoAppPublicoRepositorio } from 'autenticacao/interfaces/autenticacao-app-publico-repositorio.interface';

@Injectable()
export class AutenticacaoAppPublicoRepositorioImpl
  implements AutenticacaoAppPublicoRepositorio
{
  constructor(
    @InjectRepository(UsuarioAppPublio)
    private readonly repositorioUserAppPublico: Repository<UsuarioAppPublio>
  ) {}
  async buscarUsuarioAppPublicoEmail(
    email: string
  ): Promise<UsuarioAppPublio | null> {
    try {
      const usuario = await this.repositorioUserAppPublico.findOne({
        where: { email },
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
        where: { cpf },
      });

      if (!usuario || !usuario.senha) {
        return {
          success: false,
          message: 'Usuário não encontrado ou senha não definida',
        };
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        senha,
        usuario.senha
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
