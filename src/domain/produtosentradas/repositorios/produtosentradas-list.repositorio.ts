import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  FornecedorType,
  ProdutoEntradaType,
  ProdutoEntradasListAdminRespostaDto,
} from '../dtos/produtosEntradas-list-admin-resposta.dto';
import { ProdutosentradasListRepositorio } from '../interfaces/produtosentradas-list-repositorio.interface';

@Injectable()
export class ProdutosEntradasListRepositorioImpl
  implements ProdutosentradasListRepositorio
{
  constructor(
    @InjectRepository(ProdutoEntradasListAdminRespostaDto)
    private readonly repositorio: Repository<ProdutoEntradasListAdminRespostaDto>
  ) {}

  async buscarProdutosEntradas(
    produtoId: number,
    clienteId: number
  ): Promise<ProdutoEntradasListAdminRespostaDto> {
    const sqlEntradas = `
      SELECT 
        produtoscustos_id,
        produtoscustos.produtoscustos_produto AS produtoscustos_produto,
        produtoscustos_fornecedor,
        fornecedores_nome AS nomeFornecedor,
        produtoscustos_evento,
        DATE_FORMAT(produtoscustos_data, '%d/%m/%Y %H:%i') AS produtoscustos_data,
        produtoscustos_custo,
        produtoscustos_quantidade,
        produtoscustos_ordem,
        produtoscustos_usuario,
        usuarios_nomecompleto AS nomeUsuario,
        (produtoscustos_quantidade * produtoscustos_custo) AS subtotal
      FROM produtoscustos  
      LEFT JOIN fornecedores ON fornecedores_id = produtoscustos_fornecedor 
      LEFT JOIN usuarios ON usuarios_id = produtoscustos_usuario 
      LEFT JOIN (
        SELECT entradas.produtoscustos_produto, SUM(entradas.produtoscustos_ordem) AS qtdordens 
        FROM produtoscustos entradas 
        GROUP BY entradas.produtoscustos_produto
      ) entradas ON entradas.produtoscustos_produto = produtoscustos.produtoscustos_produto 
      WHERE produtoscustos.produtoscustos_produto = ?
      ORDER BY produtoscustos_data DESC;
    `;

    const sqlFornecedores = `
      SELECT 
        fornecedores_id,
        fornecedores_nome
      FROM fornecedores 
      WHERE fornecedores_cliente = ? 
      ORDER BY fornecedores_nome;
    `;

    try {
      const entradas: ProdutoEntradaType[] = await this.repositorio.query(
        sqlEntradas,
        [produtoId]
      );

      const fornecedores: FornecedorType[] = await this.repositorio.query(
        sqlFornecedores,
        [clienteId]
      );
      const dataReturn: ProdutoEntradasListAdminRespostaDto = {
        produtosEntradas: entradas,
        fornecedores: fornecedores,
      };
      // console.log('produtos', produtosEntradas);
      return dataReturn;
    } catch (error) {
      console.error('Erro ao buscar entradas de estoque:', error);
      throw new Error('Erro ao executar a consulta de entradas');
    }
  }
}
