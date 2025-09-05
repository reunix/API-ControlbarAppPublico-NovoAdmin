import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { FornecedorControlador } from './controladores/fornecedores.controlador';
import { FornecedorListRepositorioImpl } from './repositorios/fornecedores-list.repositorio'; // Corrigido o nome do arquivo
import { FornecedorCrudRepositorioImpl } from './repositorios/fornecedores-crud.repositorio';
import { FornecedorAddUpdateModelo } from './modelos/fornecedores-addupdate.modelo';
import { Repository } from 'typeorm';
import { FornecedorListRespostaDto } from './dtos/fornecedoresList-resposta.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FornecedorListRespostaDto,
      FornecedorAddUpdateModelo,
    ]),
  ],
  controllers: [FornecedorControlador],
  providers: [
    {
      provide: 'FornecedorListRepositorio',
      useFactory: (repository: Repository<FornecedorListRespostaDto>) => {
        return new FornecedorListRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(FornecedorListRespostaDto)],
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
