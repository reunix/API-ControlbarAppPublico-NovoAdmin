import { FornecedorListRespostaDto } from '../dtos/fornecedoresList-resposta.dto';

export interface FornecedorListAdminRepositorio {
  buscarFornecedoresAdmin(
    cliente_id: number
  ): Promise<FornecedorListRespostaDto>;
}
