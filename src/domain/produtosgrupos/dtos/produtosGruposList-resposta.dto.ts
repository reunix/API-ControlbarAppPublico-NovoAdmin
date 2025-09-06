export class ProdutosGruposListRespostaDto {
  produtosgrupos_id: number;
  produtosgrupos_nome: string;
  produtosgrupos_cliente: number;

  constructor(data: Partial<ProdutosGruposListRespostaDto>) {
    Object.assign(this, data);
  }
}
