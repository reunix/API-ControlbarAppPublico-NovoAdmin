export class ProdutoListAdminDto {
  produtos_id: number;
  produtos_nome: string;
  produtos_tipo: string;
  produtos_tipo_nome: string;
  produtos_notificacao_estoque: string;
  produtos_retirada_automatica_na_entrada: string;
  produtos_percentualalerta: number;
  produtos_impressao_preparo: string;
  produtos_evento: number;
  produtos_itemdevenda: string;
  produtos_gelado: string;
  produtos_valor: string;
  produtos_valorweb: string;
  produtos_ponto_processo: number;
  produtos_qtddoses_total: number;
  produtos_qtddoses: number;
  produtos_qtdentradas: number;
  nomePontoPreparo: string;
  nomePontoProdutoProcessado: string;
  produtos_qtdvendido: string;
  dose_ml: string;
  itenscomposicao: number;
  itenscompostos: number;
  qtdordemconsumo: number;
  produtos_ml: number;
  qtddistribuido: number;
  qtdretiradasdose: number;
  qtdretiradasunidades: number;
  qtdsaidas: number;
  qtdosesdisponivel: number;
  qtdestoque: number;
  nomegrupo: string;
  nomesubgrupo: string;
  produtos_grupo: string;
  produtos_exibe_no_imobilizado: string;
  produtos_subgrupo: string;
  imagem: string;
  produtos_venda_online: string;
  clientes_id: number;

  constructor(data: Partial<ProdutoListAdminDto>) {
    Object.assign(this, data);
  }
}
