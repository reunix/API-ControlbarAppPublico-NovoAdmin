export class EventoDespesasListRespostaDto {
  despesas_id: number;
  despesas_descricao: string;
  despesas_tipo: string;
  despesas_tipo_despesa: string;
  despesas_produto: number;
  despesas_evento: number;
  despesas_valor: number;
  despesas_quantidade: number;
  subtotal: number;

  constructor(data: Partial<EventoDespesasListRespostaDto>) {
    Object.assign(this, data);
  }
}
