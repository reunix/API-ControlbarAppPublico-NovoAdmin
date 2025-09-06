import { ProdutosGruposListRespostaDto } from '../dtos/produtosGruposList-resposta.dto';

export interface FornecedorListAdminRepositorio {
  buscarFornecedoresAdmin(
    cliente_id: number
  ): Promise<ProdutosGruposListRespostaDto>;
}
