import { AtualizaEventoDespesaDto } from '../dtos/atualiza-eventodespesas.dto';

export interface EventoDespesasCrudRepositorio {
  atualizarEventoDespesas(despesas: AtualizaEventoDespesaDto[]): Promise<void>;
  deletarEventoDespesa(despesasId: number): Promise<void>;
}
