import { AtualizaDistribuicaoDto } from '../dtos/atualiza-distribuicao.dto';

export interface DistribuicaoCrudRepositorio {
  atualizarDistribuicao(
    distribuicoes: AtualizaDistribuicaoDto[]
  ): Promise<void>;
  deletarDistribuicao(distribuicaoId: number): Promise<void>;
}
