import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { FornecedorControlador } from './controladores/fornecedores.controlador';
import { FornecedorListRepositorioImpl } from './repositorios/fornecedores-list.repositorio'; // Corrigido o nome do arquivo
import { FornecedorCrudRepositorioImpl } from './repositorios/fornecedores-crud.repositorio';
import { FornecedorAddUpdateModelo } from './modelos/fornecedores-addupdate.modelo';
import { Repository } from 'typeorm';
import { ProdutosSubGruposListRespostaDto } from './dtos/produtosSubgruposList-resposta.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProdutosSubGruposListRespostaDto,
      FornecedorAddUpdateModelo,
    ]),
  ],
  controllers: [FornecedorControlador],
  providers: [
    {
      provide: 'FornecedorListRepositorio',
      useFactory: (
        repository: Repository<ProdutosSubGruposListRespostaDto>
      ) => {
        return new FornecedorListRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(ProdutosSubGruposListRespostaDto)],
    },
    {
      provide: 'FornecedorCrudRepositorio',
      useFactory: (repository: Repository<FornecedorAddUpdateModelo>) => {
        return new FornecedorCrudRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(FornecedorAddUpdateModelo)],
    },
  ],
  exports: ['FornecedorListRepositorio', 'FornecedorCrudRepositorio'],
})
export class FornecedorModulo {}
