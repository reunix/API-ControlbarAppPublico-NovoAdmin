import { Repository } from 'typeorm';
import { AtualizaFornecedorDto } from '../dtos/atualiza-fornecedores.dto';
import { FornecedorCrudRepositorio } from '../interfaces/fornecedores-addupdate-repositorio.interface';
import { FornecedorModel } from '../modelos/fornecedores.modelo';

export class FornecedorCrudRepositorioImpl
  implements FornecedorCrudRepositorio
{
  constructor(private readonly repository: Repository<FornecedorModel>) {
    // Verificar se o repositório foi injetado corretamente
    if (!this.repository) {
      throw new Error('Repositório não foi injetado corretamente');
    }
  }

  async atualizarFornecedor(
    fornecedorData: AtualizaFornecedorDto
  ): Promise<FornecedorModel> {
    // Criar queryRunner fora do try para estar disponível no finally
    let queryRunner = null;
    let fornecedor: FornecedorModel;

    try {
      queryRunner = this.repository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (fornecedorData.fornecedores_id) {
        // Update se despesas_id existe
        const result = await queryRunner.manager.update(
          FornecedorModel,
          {
            fornecedores_id: fornecedorData.fornecedores_id,
          },
          {
            fornecedores_nome: fornecedorData.fornecedores_nome,
          }
        );

        if (result.affected === 0) {
          throw new Error(
            `Fornecedor com ID ${fornecedorData.fornecedores_id} não encontrado.`
          );
        }

        fornecedor = {
          fornecedores_id: fornecedorData.fornecedores_id,
          fornecedores_nome: fornecedorData.fornecedores_nome,
          fornecedores_cliente: fornecedorData.fornecedores_cliente,
        } as FornecedorModel;
      } else {
        // Insert se despesas_id não existe
        const newFornecedor = queryRunner.manager.create(FornecedorModel, {
          fornecedores_nome: fornecedorData.fornecedores_nome,
          fornecedores_cliente: fornecedorData.fornecedores_cliente,
        });

        fornecedor = await queryRunner.manager.save(
          FornecedorModel,
          newFornecedor
        );
      }

      await queryRunner.commitTransaction();

      return fornecedor;
    } catch (error) {
      // Capturar e logar qualquer erro, incluindo falhas na criação do queryRunner
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error(
        `Erro ao atualizar fornecedor: ${errorMessage}`,
        errorStack
      );
      if (queryRunner && queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error; // Propagar o erro para o controlador
    } finally {
      // Garantir que o queryRunner seja liberado, se foi criado
      if (queryRunner && !queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async deletarFornecedor(fornecedorId: number): Promise<void> {
    const despesa = await this.repository.findOne({
      where: { fornecedores_id: fornecedorId },
    });
    if (!despesa) {
      throw new Error('Fornecedor não encontrada');
    }
    await this.repository.delete(fornecedorId);
  }
}
