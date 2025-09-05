import { DistribuicaoListRespostaDto } from '../dtos/distribuicaoList-resposta.dto';

export interface DistribuicaoListAdminRepositorio {
  buscarDistribuicoesProdutoAdmin(
    produto_id: number
  ): Promise<DistribuicaoListRespostaDto[]>;
}
