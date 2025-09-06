import { ConsignadosListRespostaDto } from '../dtos/consignadosList-resposta.dto';

export interface ConsignadosListRepositorio {
  buscarProdutosParaConsignados(
    evento_id: number
  ): Promise<ConsignadosListRespostaDto[]>;
}
