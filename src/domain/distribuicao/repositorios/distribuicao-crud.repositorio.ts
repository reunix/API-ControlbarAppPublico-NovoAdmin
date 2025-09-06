import { Repository } from 'typeorm';
import { AtualizaDistribuicaoDto } from '../dtos/atualiza-distribuicao.dto';
import { DistribuicaoCrudRepositorio } from '../interfaces/distribuicao-addupdate-repositorio.interface';
import { DistribuicaoAddUpdateModelo } from '../modelos/distribuicao-addupdate.modelo';

export class DistribuicaoCrudRepositorioImpl
  implements DistribuicaoCrudRepositorio
{
  constructor(
    private readonly repository: Repository<DistribuicaoAddUpdateModelo>
  ) {
    // Verificar se o repositório foi injetado corretamente
    if (!this.repository) {
      throw new Error('Repositório não foi injetado corretamente');
    }
  }

  async atualizarDistribuicao(
    distribuicoes: AtualizaDistribuicaoDto[]
  ): Promise<void> {
    // Criar queryRunner fora do try para estar disponível no finally
    let queryRunner = null;
    try {
      queryRunner = this.repository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const despesa of distribuicoes) {
        if (despesa.despesas_id) {
          // Update se despesas_id existe
          const result = await queryRunner.manager.update(
            DistribuicaoAddUpdateModelo,
            {
              despesas_id: despesa.despesas_id,
            },
            {
              despesas_descricao: despesa.despesas_descricao,
              despesas_tipo: despesa.despesas_tipo,
              despesas_tipo_despesa: despesa.despesas_tipo_despesa,
              despesas_produto: despesa.despesas_produto,
              despesas_evento: despesa.despesas_evento,
              despesas_valor: despesa.despesas_valor,
              despesas_quantidade: despesa.despesas_quantidade,
            }
          );

          if (result.affected === 0) {
            throw new Error(
              `Distribuição com ID ${despesa.despesas_id} não encontrado.`
            );
          }
        } else {
          // Insert se despesas_id não existe
          const newDespesa = queryRunner.manager.create(
            DistribuicaoAddUpdateModelo,
            {
              despesas_descricao: despesa.despesas_descricao,
              despesas_tipo: despesa.despesas_tipo,
              despesas_tipo_despesa: despesa.despesas_tipo_despesa,
              despesas_produto: despesa.despesas_produto,
              despesas_evento: despesa.despesas_evento,
              despesas_valor: despesa.despesas_valor,
              despesas_quantidade: despesa.despesas_quantidade,
            }
          );

          await queryRunner.manager.save(
            DistribuicaoAddUpdateModelo,
            newDespesa
          );
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      // Capturar e logar qualquer erro, incluindo falhas na criação do queryRunner
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error(
        `Erro ao atualizar distribuição: ${errorMessage}`,
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

  async deletarDistribuicao(despesasId: number): Promise<void> {
    const despesa = await this.repository.findOne({
      where: { despesas_id: despesasId },
    });
    if (!despesa) {
      throw new Error('Despesa não encontrada');
    }
    await this.repository.delete(despesasId);
  }
}
