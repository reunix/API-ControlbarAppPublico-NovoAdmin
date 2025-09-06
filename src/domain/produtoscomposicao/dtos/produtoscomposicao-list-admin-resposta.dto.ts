export type ProdutoComposicaoItensType = {
  produtoscomposicao_id: number;
  produtoscomposicao_produto: number;
  produtoscomposicao_produtoprincipal: number;
  produtoscomposicao_tipo: string;
  produtoscomposicao_quantidade: number;
  produtoscomposicao_gelado: string;
  produtoscomposicao_datacad: string;
  produtos_ml: number;
  produtos_qtddoses_total: number;
  dose_ml: string;
  produtos_nome: string;
};

export type ProdutosItensComposicaoType = {
  produtos_id: number;
  produtos_nome: string;
  produtos_gelado: string;
  produtos_ml: number;
  produtos_qtddoses_total: number;
};

export class ProdutosComposicaoListAdminRespostaDto {
  produtosComposicao: ProdutoComposicaoItensType[];
  produtosItens: ProdutosItensComposicaoType[];

  constructor(data: Partial<ProdutosComposicaoListAdminRespostaDto>) {
    this.produtosComposicao = data.produtosComposicao || [];
    this.produtosItens = data.produtosItens || [];
  }
}
