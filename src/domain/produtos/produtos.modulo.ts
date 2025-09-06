import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosControlador } from './controladores/produtos.controlador';
import { ProdutosListAdminRepositorioImpl } from './repositorios/produtos.repositorio';
import { ProdutoModel } from './modelos/produtos-update.modelo';
import { ProdutoListAdminRespostaDto } from './dtos/produtos-list-admin-resposta.dto';
import { ProdutosCrudRepositorioImpl } from './repositorios/produtos-crud.repositorio';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutoModel, ProdutoListAdminRespostaDto]),
  ],
  controllers: [ProdutosControlador],

  providers: [
    {
      provide: 'ProdutosRepositorio',
      useFactory: (repository: Repository<ProdutoListAdminRespostaDto>) => {
        return new ProdutosListAdminRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(ProdutoListAdminRespostaDto)],
    },
    {
      provide: 'ProdutosCrudRepositorio',
      useFactory: (repository: Repository<ProdutoModel>) => {
        return new ProdutosCrudRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(ProdutoModel)],
    },
  ],
  exports: ['ProdutosRepositorio', 'ProdutosCrudRepositorio'],
})
export class ProdutosModulo {}
