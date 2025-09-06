import { Repository } from 'typeorm';
import { AtualizaProdutosComposicaoDto } from '../dtos/atualiza-produtoscomposicao.dto';
import { ProdutosComposicaoCrudRepositorio } from '../interfaces/produtoscomposicao-crud-repositorio.interface';
import { ProdutosComposicaoCrudModelo } from '../modelos/produtoscomposicao-crud.modelo';

export class ProdutosComposicaoCrudRepositorioImpl
  implements ProdutosComposicaoCrudRepositorio
{
  constructor(
    private readonly repository: Repository<ProdutosComposicaoCrudModelo>
  ) {
    // Verificar se o repositório foi injetado corretamente
    if (!this.repository) {
      throw new Error('Repositório não foi injetado corretamente');
    }
  }

  async atualizarComposicoes(
    composicoes: AtualizaProdutosComposicaoDto[]
  ): Promise<void> {
    // Criar queryRunner fora do try para estar disponível no finally
    let queryRunner = null;
    try {
      queryRunner = this.repository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const itemcomposicao of composicoes) {
        if (itemcomposicao.produtoscomposicao_id) {
          // Update se produtoscustos_id existe

          const result = await queryRunner.manager.update(
            ProdutosComposicaoCrudModelo,
            {
              produtoscomposicao_id: itemcomposicao.produtoscomposicao_id,
            },
            itemcomposicao
          );

          if (result.affected === 0) {
            throw new Error(
              `Composição com ID ${itemcomposicao.produtoscomposicao_id} não encontrada.`
            );
          }
        } else {
          // Insert se produtoscustos_id não existe
          const newComposicao = queryRunner.manager.create(
            ProdutosComposicaoCrudModelo,
            itemcomposicao
          );

          await queryRunner.manager.save(
            ProdutosComposicaoCrudModelo,
            newComposicao
          );
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      // Capturar e logar qualquer erro, incluindo falhas na criação do queryRunner
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error(`Erro ao atualizar entradas: ${errorMessage}`, errorStack);
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

  async deletarComposicao(composicaoId: number): Promise<void> {
    const entradas = await this.repository.findOne({
      where: { produtoscomposicao_id: composicaoId },
    });
    if (!entradas) {
      throw new Error('Composição não encontrada');
    }
    await this.repository.delete(composicaoId);
  }
}
