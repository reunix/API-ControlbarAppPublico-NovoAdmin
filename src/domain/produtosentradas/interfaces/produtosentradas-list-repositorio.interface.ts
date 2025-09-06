import { ProdutoEntradasListAdminRespostaDto } from '../dtos/produtosEntradas-list-admin-resposta.dto';

export interface ProdutosentradasListRepositorio {
  buscarProdutosEntradas(
    produto_id: number,
    clienteId: number
  ): Promise<ProdutoEntradasListAdminRespostaDto>;
}
