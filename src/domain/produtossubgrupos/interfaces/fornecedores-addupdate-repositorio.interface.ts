import { AtualizaFornecedorDto } from '../dtos/atualiza-fornecedores.dto';
import { FornecedorModel } from '../modelos/fornecedores.modelo';

export interface FornecedorCrudRepositorio {
  atualizarFornecedor(
    fornecedor: AtualizaFornecedorDto
  ): Promise<FornecedorModel>;
  deletarFornecedor(fornecedorId: number): Promise<void>;
}
