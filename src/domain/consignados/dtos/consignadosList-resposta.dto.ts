export class ConsignadosListRespostaDto {
  produtoId: number;
  consignado_id: number;
  produtoNome: string;
  qtdEntradas: number;
  qtdSaidas: number;
  qtdDiferenca: number;
  saldo: number;
  devolucaoBar: number;
  devolucaoFornecedor: number;

  constructor(data: Partial<ConsignadosListRespostaDto>) {
    Object.assign(this, data);
  }
}
