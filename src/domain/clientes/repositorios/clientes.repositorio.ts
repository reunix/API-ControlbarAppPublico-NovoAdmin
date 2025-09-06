import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Cliente } from '../modelos/cliente.modelo';
import { ClientesRepositorio } from '../interfaces/clientes-repositorio.interface';

@Injectable()
export class ClientesRepositorioImpl implements ClientesRepositorio {
  constructor(
    @InjectRepository(Cliente)
    private readonly repositorio: Repository<Cliente>
  ) {}

  async buscarPorNome(nome: string): Promise<Cliente[]> {
    return this.repositorio.find({ where: { nome: Like(`%${nome}%`) } });
  }
}
