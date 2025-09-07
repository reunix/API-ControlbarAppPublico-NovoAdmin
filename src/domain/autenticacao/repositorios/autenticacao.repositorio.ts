import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioAdmin } from '../modelos/usuario-admin.modelo';
import { AutenticacaoRepositorio } from '../interfaces/autenticacao-repositorio.interface';

@Injectable()
export class AutenticacaoRepositorioImpl implements AutenticacaoRepositorio {
  constructor(
    @InjectRepository(UsuarioAdmin)
    private readonly repositorio: Repository<UsuarioAdmin>
  ) {}

  async buscarUsuarioPorLoginESenha(
    email: string,
    senha: string
  ): Promise<UsuarioAdmin | null> {
    return this.repositorio.findOne({ where: { email, senha } });
  }
}
