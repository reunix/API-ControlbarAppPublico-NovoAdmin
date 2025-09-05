import { Repository } from 'typeorm';
import { AtualizaConsignadoDto } from '../dtos/atualiza-consignados.dto';
import { ConsignadosAddUpdateRepositorio } from '../interfaces/consignados-addupdate-repositorio.interface';
import { ConsignadoAddUpdateModelo } from '../modelos/consignado-addupdate.modelo';

export class ConsignadosAddUpdateRepositorioImpl
  implements ConsignadosAddUpdateRepositorio
{
  constructor(
    private readonly repository: Repository<ConsignadoAddUpdateModelo>
  ) {
    // Verificar se o repositório foi injetado corretamente
    if (!this.repository) {
      throw new Error('Repositório não foi injetado corretamente');
    }
  }

  async atualizarConsignados(
    consignados: AtualizaConsignadoDto[]
  ): Promise<void> {
    // Declarar updatedAndInserted no início do método para garantir escopo
    // const updatedAndInserted: ConsignadoAddUpdateModelo[] = [];

    // Criar queryRunner fora do try para estar disponível no finally
    let queryRunner = null;
    try {
      queryRunner = this.repository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const consignado of consignados) {
        if (consignado.consignado_id) {
          // Update se consignado_id existe
          const result = await queryRunner.manager.update(
            ConsignadoAddUpdateModelo,
            {
              consigdevolvidos_id: consignado.consignado_id,
              consigdevolvidos_evento: consignado.produtos_evento,
            },
            {
              consigdevolvidos_qtd: consignado.devolucaoFornecedor,
              consigdevolvidos_qtdreal: consignado.devolucaoBar,
            }
          );

          if (result.affected === 0) {
            throw new Error(
              `Consignado com ID ${consignado.consignado_id} não encontrado.`
            );
          }
        } else {
          // Insert se consignado_id não existe
          const newConsignado = queryRunner.manager.create(
            ConsignadoAddUpdateModelo,
            {
              consigdevolvidos_produto: consignado.produtoId,
              consigdevolvidos_evento: consignado.produtos_evento,
              consigdevolvidos_qtd: consignado.devolucaoFornecedor,
              consigdevolvidos_qtdreal: consignado.devolucaoBar,
            }
          );

          // const savedConsignado = await queryRunner.manager.save(
          await queryRunner.manager.save(
            ConsignadoAddUpdateModelo,
            newConsignado
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
        `Erro ao atualizar consignados: ${errorMessage}`,
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

  async deletarConsignado(consignadoId: number): Promise<void> {
    const despesa = await this.repository.findOne({
      where: { consigdevolvidos_id: consignadoId },
    });
    if (!despesa) {
      throw new Error('Consignado não encontrado');
    }
    await this.repository.delete(consignadoId);
  }
}
