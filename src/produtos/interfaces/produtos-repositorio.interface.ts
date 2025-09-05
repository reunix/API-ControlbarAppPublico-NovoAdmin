import { ProdutoListAdminRespostaDto } from '../dtos/produtos-list-admin-resposta.dto';

export interface ProdutosRepositorio {
  buscarProdutosListAdmin(
    eventoId: string,
    clienteId: string,
    somenteComAlertas: boolean,
    somenteComEntradas: boolean,
    recuperarDadosAgregados: boolean
  ): Promise<ProdutoListAdminRespostaDto>;
}
