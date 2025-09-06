import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosComposicaoControlador } from './controladores/produtoscomposicao.controlador';
import { ProdutosComposicaoListRepositorioImpl } from './repositorios/produtoscomposicao-list.repositorio'; // Corrigido o nome do arquivo
import { ProdutosComposicaoCrudRepositorioImpl } from './repositorios/produtoscomposicao-crud.repositorio';
import { ProdutosComposicaoCrudModelo } from './modelos/produtoscomposicao-crud.modelo';
import { Repository } from 'typeorm';
import { ProdutosComposicaoListAdminRespostaDto } from './dtos/produtoscomposicao-list-admin-resposta.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProdutosComposicaoListAdminRespostaDto,
      ProdutosComposicaoCrudModelo,
    ]),
  ],
  controllers: [ProdutosComposicaoControlador],
  providers: [
    {
      provide: 'ProdutosComposicaoListRepositorio',
      useFactory: (
        repository: Repository<ProdutosComposicaoListAdminRespostaDto>
      ) => {
        return new ProdutosComposicaoListRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(ProdutosComposicaoListAdminRespostaDto)],
    },
    {
      provide: 'ProdutosComposicaoCrudRepositorio',
      useFactory: (repository: Repository<ProdutosComposicaoCrudModelo>) => {
        return new ProdutosComposicaoCrudRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(ProdutosComposicaoCrudModelo)],
    },
  ],
  exports: [
    'ProdutosComposicaoListRepositorio',
    'ProdutosComposicaoCrudRepositorio',
  ],
})
export class ProdutosComposicao {}
