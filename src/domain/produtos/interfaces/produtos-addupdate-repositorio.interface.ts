import { ProdutoModel } from 'domain/produtos/modelos/produtos-update.modelo';
import { ProdutoCrudDto } from '../dtos/atualiza-produtos.dto';

export interface ProdutosCrudRepositorio {
  atualizarProdutos(produto: ProdutoCrudDto): Promise<ProdutoModel>;
  deletarProdutos(consignadoId: number): Promise<void>;
}
