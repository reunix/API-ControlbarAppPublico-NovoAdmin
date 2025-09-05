import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DistribuicaoControlador } from './controladores/distribuicao.controlador';
import { DistribuicaoListRepositorioImpl } from './repositorios/distribuicao-list.repositorio'; // Corrigido o nome do arquivo
import { DistribuicaoCrudRepositorioImpl } from './repositorios/distribuicao-crud.repositorio';
import { DistribuicaoAddUpdateModelo } from './modelos/distribuicao-addupdate.modelo';
import { Repository } from 'typeorm';
import { DistribuicaoListRespostaDto } from './dtos/distribuicaoList-resposta.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DistribuicaoListRespostaDto,
      DistribuicaoAddUpdateModelo,
    ]),
  ],
  controllers: [DistribuicaoControlador],
  providers: [
    {
      provide: 'DistribuicaoListRepositorio',
      useFactory: (repository: Repository<DistribuicaoListRespostaDto>) => {
        return new DistribuicaoListRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(DistribuicaoListRespostaDto)],
    },
    {
      provide: 'DistribuicaoCrudRepositorio',
      useFactory: (repository: Repository<DistribuicaoAddUpdateModelo>) => {
        return new DistribuicaoCrudRepositorioImpl(repository);
      },
      inject: [getRepositoryToken(DistribuicaoAddUpdateModelo)],
    },
  ],
  exports: ['DistribuicaoListRepositorio', 'DistribuicaoCrudRepositorio'],
})
export class DistribuicaoModulo {}
