import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../modelos/usuario.modelo';
import { AutenticacaoRepositorio } from '../interfaces/autenticacao-repositorio.interface';

@Injectable()
export class AutenticacaoRepositorioImpl implements AutenticacaoRepositorio {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorio: Repository<Usuario>
  ) {}

  async buscarUsuarioPorLoginESenha(
    email: string,
    senha: string
  ): Promise<Usuario | null> {
    return this.repositorio.findOne({ where: { email, senha } });
  }
}
