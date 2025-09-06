import { Repository } from 'typeorm';
import { ProdutoCrudDto } from '../dtos/atualiza-produtos.dto';
import { ProdutosCrudRepositorio } from '../interfaces/produtos-addupdate-repositorio.interface';
import { ProdutoModel } from '../modelos/produtos-update.modelo';

export class ProdutosCrudRepositorioImpl implements ProdutosCrudRepositorio {
  constructor(private readonly repository: Repository<ProdutoModel>) {
    // Verificar se o repositório foi injetado corretamente
    if (!this.repository) {
      throw new Error('Repositório não foi injetado corretamente');
    }
  }

  async atualizarProdutos(produtoData: ProdutoCrudDto): Promise<ProdutoModel> {
    // Criar queryRunner fora do try para estar disponível no finally
    let queryRunner = null;
    let produto: ProdutoModel;

    try {
      queryRunner = this.repository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (produtoData.produtos_id) {
        // Update se produtos_id existe
        console.log('Update');
        const result = await queryRunner.manager.update(
          ProdutoModel,
          {
            produtos_id: produtoData.produtos_id,
          },
          produtoData
          // {
          //   produtos_nome: produtoData.produtos_nome,
          // }
        );

        if (result.affected === 0) {
          throw new Error(
            `Produto com ID ${produtoData.produtos_id} não encontrado.`
          );
        }

        // produto = {
        //   produtos_id: produtoData.produtos_id,
        //   produtos_nome: produtoData.produtos_nome,
        //   // fornecedores_cliente: produtoData.fornecedores_cliente,
        // } as ProdutoModel;

        produto = produtoData as ProdutoModel;
      } else {
        // Insert se produots_id não existe
        console.log('insert');
        const newProduto = queryRunner.manager.create(ProdutoModel, {
          produtos_nome: produtoData.produtos_nome,
          // fornecedores_cliente: produtoData.fornecedores_cliente,
        });

        produto = await queryRunner.manager.save(ProdutoModel, newProduto);
      }

      await queryRunner.commitTransaction();

      return produto;
    } catch (error) {
      // Capturar e logar qualquer erro, incluindo falhas na criação do queryRunner
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error(`Erro ao atualizar produto: ${errorMessage}`, errorStack);
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

  async deletarProdutos(produtoId: number): Promise<void> {
    const produto = await this.repository.findOne({
      where: { produtos_id: produtoId },
    });
    if (!produto) {
      throw new Error('Produto não encontrado');
    }
    await this.repository.delete(produtoId);
  }
}
