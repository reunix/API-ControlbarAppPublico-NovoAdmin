import { ProdutosSubGruposListRespostaDto } from '../dtos/produtosSubgruposList-resposta.dto';

export interface FornecedorListAdminRepositorio {
  buscarFornecedoresAdmin(
    cliente_id: number
  ): Promise<ProdutosSubGruposListRespostaDto>;
}
