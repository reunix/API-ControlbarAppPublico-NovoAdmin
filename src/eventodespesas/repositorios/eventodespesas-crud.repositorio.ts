import { Repository } from 'typeorm';
import { AtualizaEventoDespesaDto } from '../dtos/atualiza-eventodespesas.dto';
import { EventoDespesasCrudRepositorio } from '../interfaces/eventodespesas-addupdate-repositorio.interface';
import { EventoDespesaAddUpdateModelo } from '../modelos/eventodespesas-addupdate.modelo';

export class EventoDespesasCrudRepositorioImpl
  implements EventoDespesasCrudRepositorio
{
  constructor(
    private readonly repository: Repository<EventoDespesaAddUpdateModelo>
  ) {
    // Verificar se o repositório foi injetado corretamente
    if (!this.repository) {
      throw new Error('Repositório não foi injetado corretamente');
    }
  }

  async atualizarEventoDespesas(
    despesas: AtualizaEventoDespesaDto[]
  ): Promise<void> {
    // Criar queryRunner fora do try para estar disponível no finally
    let queryRunner = null;
    try {
      queryRunner = this.repository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const despesa of despesas) {
        if (despesa.despesas_id) {
          // Update se despesas_id existe
          const result = await queryRunner.manager.update(
            EventoDespesaAddUpdateModelo,
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
              `Despesa com ID ${despesa.despesas_id} não encontrado.`
            );
          }
        } else {
          // Insert se despesas_id não existe
          const newDespesa = queryRunner.manager.create(
            EventoDespesaAddUpdateModelo,
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
            EventoDespesaAddUpdateModelo,
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
      console.error(`Erro ao atualizar despesas: ${errorMessage}`, errorStack);
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

  async deletarEventoDespesa(despesasId: number): Promise<void> {
    const despesa = await this.repository.findOne({
      where: { despesas_id: despesasId },
    });
    if (!despesa) {
      throw new Error('Despesa não encontrada');
    }
    await this.repository.delete(despesasId);
  }
}
