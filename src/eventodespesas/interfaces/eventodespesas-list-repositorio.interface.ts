import { EventoDespesasListRespostaDto } from '../dtos/eventodespesasList-resposta.dto';

export interface EventoDespesasListRepositorio {
  buscarEventoDespesas(
    evento_id: number
  ): Promise<EventoDespesasListRespostaDto[]>;
}
