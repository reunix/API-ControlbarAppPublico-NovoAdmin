import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoEntradasControlador } from './controladores/produtosentradas.controlador';
//import { EventoDespesasListRepositorioImpl } from './repositorios/eventoDespesasList.repositorio';
import { ProdutosEntradasListRepositorioImpl } from './repositorios/produtosentradas-list.repositorio'; // Corrigido o nome do arquivo

import { ProdutosEntradasCrudRepositorioImpl } from './repositorios/produtosentradas-crud.repositorio';
// import { EventoDepesas } from './modelos/eventodespesas.modelo';
import { ProdutoEntradaAddUpdateModelo } from './modelos/produtosentradas-addupdate.modelo';
import { Repository } from 'typeorm';
import { ProdutoEntradasListAdminRespostaDto } from './dtos/produtosEntradas-list-admin-resposta.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProdutoEntradasListAdminRespostaDto,
      ProdutoEntradaAddUpdateModelo,
    ]),
  ],
  controllers: [ProdutoEntradasControlador],
  providers: [
    {
      provide: 'ProdutoEntradasListRepositorio',
      useFactory: (
        repository: Repository<ProdutoEntradasListAdminRespostaDto>
      ) => {
        return new ProdutosEntradasListRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(ProdutoEntradasListAdminRespostaDto)],
    },
    {
      provide: 'ProdutoEntradasCrudRepositorio',
      useFactory: (repository: Repository<ProdutoEntradaAddUpdateModelo>) => {
        return new ProdutosEntradasCrudRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(ProdutoEntradaAddUpdateModelo)],
    },
  ],
  exports: ['ProdutoEntradasListRepositorio', 'ProdutoEntradasCrudRepositorio'],
})
export class ProdutosEntradasModulo {}
