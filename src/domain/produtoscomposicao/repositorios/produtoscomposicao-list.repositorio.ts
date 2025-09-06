import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ProdutosItensComposicaoType,
  ProdutoComposicaoItensType,
  ProdutosComposicaoListAdminRespostaDto,
} from '../dtos/produtoscomposicao-list-admin-resposta.dto';
import { ComposicoesListRepositorio } from '../interfaces/produtoscomposicao-list-repositorio.interface';

@Injectable()
export class ProdutosComposicaoListRepositorioImpl
  implements ComposicoesListRepositorio
{
  constructor(
    @InjectRepository(ProdutosComposicaoListAdminRespostaDto)
    private readonly repositorio: Repository<ProdutosComposicaoListAdminRespostaDto>
  ) {}

  async buscarComposicoes(
    produtoId: number,
    eventoId: number
  ): Promise<ProdutosComposicaoListAdminRespostaDto> {
    const sqlCompsicoes = `SELECT 
    produtoscomposicao_id, 
    produtoscomposicao_gelado, 
    produtoscomposicao_quantidade,
    produtos_nome, 
    produtoscomposicao_produto,
    produtoscomposicao_produtoprincipal,
    produtoscomposicao_tipo, 
    DATE_FORMAT(produtoscomposicao_datacad, '%d/%m/%Y %H:%i') AS produtoscomposicao_datacad,
    COALESCE(produtos_ml, 0)              AS produtos_ml, 
    COALESCE(produtos_qtddoses_total, 0)  AS produtos_qtddoses_total, 
    
    CASE 
      WHEN COALESCE(produtos_ml, 0) > 0 AND COALESCE(produtos_qtddoses_total, 0) > 0 
      THEN CONCAT('Dosagem: ', FORMAT((produtos_ml / produtos_qtddoses_total) * produtoscomposicao_quantidade, 3), 'ml') 
      ELSE '' 
    END AS dose_ml 

    FROM produtoscomposicao 
    LEFT JOIN produtos produtos ON produtoscomposicao_produtoprincipal = produtos.produtos_id 
    WHERE produtoscomposicao_produto = ?
    ORDER BY produtoscomposicao_id `;

    // sql += "; SELECT produtos_id as id, produtos_nome AS nome, produtos_gelado, produtos_produtobase, " +
    // " COALESCE(produtos_ml,0) AS produtos_ml, " +
    // " COALESCE(produtos_qtddoses_total,0) AS produtos_qtddoses_total " +
    // " FROM produtos " +
    // " WHERE produtos_evento = ? AND produtos_tipo = 'P'  ORDER BY produtos_nome "

    const sqlProdutosItens = `
      SELECT 
        produtos_id,
        produtos_nome,
        produtos_gelado,
        COALESCE(produtos_ml,0) AS produtos_ml,
        COALESCE(produtos_qtddoses_total,0) AS produtos_qtddoses_total
        
      FROM produtos 
      WHERE produtos_evento = ?  AND  (produtos_ponto_processo IS NOT NULL OR produtos_tipo = 'P')
      ORDER BY produtos_nome;
    `;

    try {
      const composicoes: ProdutoComposicaoItensType[] =
        await this.repositorio.query(sqlCompsicoes, [produtoId]);

      const produtosItens: ProdutosItensComposicaoType[] =
        await this.repositorio.query(sqlProdutosItens, [eventoId]);

      const dataReturn: ProdutosComposicaoListAdminRespostaDto = {
        produtosComposicao: composicoes,
        produtosItens: produtosItens,
      };
      // console.log('produtos', produtosEntradas);
      return dataReturn;
    } catch (error) {
      console.error('Erro ao buscar composições do produto:', error);
      throw new Error('Erro ao executar a consulta de composições');
    }
  }
}
