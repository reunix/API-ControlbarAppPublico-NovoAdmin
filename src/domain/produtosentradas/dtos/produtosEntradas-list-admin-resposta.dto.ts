export type ProdutoEntradaType = {
  produtoscustos_id: number;
  produtoscustos_produto: number;
  produtoscustos_fornecedor: number;
  nomeFornecedor: string;
  produtoscustos_evento: number;
  produtoscustos_data: string;
  produtoscustos_custo: number;
  produtoscustos_quantidade: number;
  produtoscustos_ordem: number;
  produtoscustos_usuario: number;
  nomeUsuario: string;
  subtotal: number;
};

export type FornecedorType = {
  fornecedores_id: number;
  fornecedores_nome: string;
};

export class ProdutoEntradasListAdminRespostaDto {
  produtosEntradas: ProdutoEntradaType[];
  fornecedores: FornecedorType[];

  constructor(data: Partial<ProdutoEntradasListAdminRespostaDto>) {
    this.produtosEntradas = data.produtosEntradas || [];
    this.fornecedores = data.fornecedores || [];
  }
}
