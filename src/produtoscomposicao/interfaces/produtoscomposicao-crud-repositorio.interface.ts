import { AtualizaProdutosComposicaoDto } from '../dtos/atualiza-produtoscomposicao.dto';

export interface ProdutosComposicaoCrudRepositorio {
  atualizarComposicoes(
    composicoes: AtualizaProdutosComposicaoDto[]
  ): Promise<void>;
  deletarComposicao(composicaoId: number): Promise<void>;
}
