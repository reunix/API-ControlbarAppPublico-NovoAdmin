import { ProdutosComposicaoListAdminRespostaDto } from '../dtos/produtoscomposicao-list-admin-resposta.dto';

export interface ComposicoesListRepositorio {
  buscarComposicoes(
    produto_id: number,
    evento_id: number
  ): Promise<ProdutosComposicaoListAdminRespostaDto>;
}
