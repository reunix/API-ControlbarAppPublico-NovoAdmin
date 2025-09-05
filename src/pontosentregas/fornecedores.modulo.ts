import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { FornecedorControlador } from './controladores/fornecedores.controlador';
import { FornecedorListRepositorioImpl } from './repositorios/fornecedores-list.repositorio'; // Corrigido o nome do arquivo
import { FornecedorCrudRepositorioImpl } from './repositorios/fornecedores-crud.repositorio';
import { FornecedorAddUpdateModelo } from './modelos/fornecedores-addupdate.modelo';
import { Repository } from 'typeorm';
import { PontosEntregasListRespostaDto } from './dtos/pontosEntregasList-resposta.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PontosEntregasListRespostaDto,
      FornecedorAddUpdateModelo,
    ]),
  ],
  controllers: [FornecedorControlador],
  providers: [
    {
      provide: 'FornecedorListRepositorio',
      useFactory: (repository: Repository<PontosEntregasListRespostaDto>) => {
        return new FornecedorListRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(PontosEntregasListRespostaDto)],
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
