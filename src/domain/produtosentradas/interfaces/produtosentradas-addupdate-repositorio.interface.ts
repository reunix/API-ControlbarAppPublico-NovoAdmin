import { AtualizaProdutosEntradaDto } from '../dtos/atualiza-produtosentradas.dto';

export interface ProdutoEntradasCrudRepositorio {
  atualizarProdutoEntradaS(
    despesas: AtualizaProdutosEntradaDto[]
  ): Promise<void>;
  deletarProdutoEntrada(entradaId: number): Promise<void>;
}
