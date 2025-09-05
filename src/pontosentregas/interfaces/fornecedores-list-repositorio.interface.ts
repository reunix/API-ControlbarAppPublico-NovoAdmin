import { PontosEntregasListRespostaDto } from '../dtos/pontosEntregasList-resposta.dto';

export interface FornecedorListAdminRepositorio {
  buscarFornecedoresAdmin(
    cliente_id: number
  ): Promise<PontosEntregasListRespostaDto>;
}
