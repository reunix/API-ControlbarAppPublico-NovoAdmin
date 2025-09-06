export class DistribuicaoListRespostaDto {
  produtosdistribuicao_id: number;
  produtos_id: number;
  qtdsaidasgelado: number;
  produtos_gelado: boolean; // ou string, dependendo do tipo retornado
  nomePontoEntrega: string;
  qtdsaidas: number;
  saldoquente: number;
  saldogelado: number;
  produtosdistribuicao_qtdretiradosdoses: number;
  produtosdistribuicao_qtdretiradosunidades: number;
  qtddistribuido: number;
  quantidadeSaidasDistribuicao: number;

  constructor(data: Partial<DistribuicaoListRespostaDto>) {
    Object.assign(this, data);
  }
}
