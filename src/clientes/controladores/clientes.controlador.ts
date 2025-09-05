import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { ClientesRepositorio } from '../interfaces/clientes-repositorio.interface';
import { BuscaClientesDto } from '../dtos/busca-clientes.dto';
import { ClienteRespostaDto } from '../dtos/cliente-resposta.dto';

@Controller('clientes')
export class ClientesControlador {
  constructor(
    @Inject('ClientesRepositorio')
    private readonly repositorio: ClientesRepositorio
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async buscarPorNome(
    @Query() buscaClientesDto: BuscaClientesDto
  ): Promise<ClienteRespostaDto[]> {
    const clientes = await this.repositorio.buscarPorNome(
      buscaClientesDto.nome
    );
    return clientes.map(
      (cliente) =>
        new ClienteRespostaDto({
          id: cliente.id,
          nome: cliente.nome,
          endereco: cliente.endereco,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          telefone: cliente.telefone1,
          cnpj: cliente.cnpj,
          email: cliente.email,
        })
    );
  }
}
