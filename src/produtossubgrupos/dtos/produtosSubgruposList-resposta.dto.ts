export class ProdutosSubGruposListRespostaDto {
  produtossubgrupos_id: number;
  produtossubgrupos_nome: string;

  constructor(data: Partial<ProdutosSubGruposListRespostaDto>) {
    Object.assign(this, data);
  }
}
