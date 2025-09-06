import { Repository } from 'typeorm';
import { AtualizaProdutosEntradaDto } from '../dtos/atualiza-produtosentradas.dto';
import { ProdutoEntradasCrudRepositorio } from '../interfaces/produtosentradas-addupdate-repositorio.interface';
import { ProdutoEntradaAddUpdateModelo } from '../modelos/produtosentradas-addupdate.modelo';

export class ProdutosEntradasCrudRepositorioImpl
  implements ProdutoEntradasCrudRepositorio
{
  constructor(
    private readonly repository: Repository<ProdutoEntradaAddUpdateModelo>
  ) {
    // Verificar se o repositório foi injetado corretamente
    if (!this.repository) {
      throw new Error('Repositório não foi injetado corretamente');
    }
  }

  async atualizarProdutoEntradaS(
    entradas: AtualizaProdutosEntradaDto[]
  ): Promise<void> {
    // Criar queryRunner fora do try para estar disponível no finally
    let queryRunner = null;
    try {
      queryRunner = this.repository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const entrada of entradas) {
        if (entrada.produtoscustos_id) {
          // Update se produtoscustos_id existe

          const result = await queryRunner.manager.update(
            ProdutoEntradaAddUpdateModelo,
            {
              produtoscustos_id: entrada.produtoscustos_id,
            },
            {
              produtoscustos_produto: entrada.produtoscustos_produto,
              produtoscustos_quantidade: entrada.produtoscustos_quantidade,
              produtoscustos_custo: entrada.produtoscustos_custo,
              produtoscustos_evento: entrada.produtoscustos_evento,
              produtoscustos_fornecedor: entrada.produtoscustos_fornecedor,
              produtoscustos_ordem: entrada.produtoscustos_ordem,
              produtoscustos_usuario: entrada.produtoscustos_usuario,
            }
          );

          if (result.affected === 0) {
            throw new Error(
              `Entrada com ID ${entrada.produtoscustos_id} não encontrada.`
            );
          }
        } else {
          // Insert se produtoscustos_id não existe
          const newEntrada = queryRunner.manager.create(
            ProdutoEntradaAddUpdateModelo,
            {
              produtoscustos_produto: entrada.produtoscustos_produto,
              produtoscustos_quantidade: entrada.produtoscustos_quantidade,
              produtoscustos_custo: entrada.produtoscustos_custo,
              produtoscustos_evento: entrada.produtoscustos_evento,
              produtoscustos_fornecedor: entrada.produtoscustos_fornecedor,
              produtoscustos_ordem: entrada.produtoscustos_ordem,
              produtoscustos_usuario: entrada.produtoscustos_usuario,
            }
          );

          await queryRunner.manager.save(
            ProdutoEntradaAddUpdateModelo,
            newEntrada
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

  async deletarProdutoEntrada(produtoEntradaId: number): Promise<void> {
    const entradas = await this.repository.findOne({
      where: { produtoscustos_id: produtoEntradaId },
    });
    if (!entradas) {
      throw new Error('Entrada não encontrada');
    }
    await this.repository.delete(produtoEntradaId);
  }
}
