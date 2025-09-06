import { FornecedorModel } from '../modelos/fornecedores.modelo';
import { AtualizaFornecedorDto } from '../dtos/atualiza-fornecedores.dto';

export interface FornecedorCrudRepositorio {
  atualizarFornecedor(
    fornecedor: AtualizaFornecedorDto
  ): Promise<FornecedorModel>;
  deletarFornecedor(fornecedorId: number): Promise<void>;
}
