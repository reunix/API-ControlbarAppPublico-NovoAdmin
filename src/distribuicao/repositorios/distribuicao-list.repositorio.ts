import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { EventoDepesas } from '../modelos/eventodespesas.modelo';

import { DistribuicaoListRespostaDto } from '../dtos/distribuicaoList-resposta.dto';
import { DistribuicaoListAdminRepositorio } from '../interfaces/distribuicao-list-repositorio.interface';

@Injectable()
export class DistribuicaoListRepositorioImpl
  implements DistribuicaoListAdminRepositorio
{
  constructor(
    @InjectRepository(DistribuicaoListRespostaDto)
    private readonly repositorio: Repository<DistribuicaoListRespostaDto>
  ) {}

  async buscarDistribuicoesProdutoAdmin(
    produto_id: number
  ): Promise<DistribuicaoListRespostaDto[]> {
    const sql = `SELECT produtos_id,  
          produtosdistribuicao_id,
         COALESCE(produtosdistribuicao_qtdsaidasgelado,0) as qtdsaidasgelado, 
         produtos_gelado,
         pontosentregas.pontosentregas_nome AS nomePontoEntrega,
         COALESCE(produtosdistribuicao_qtdsaidas,0) as qtdsaidas, 

         CASE WHEN COALESCE(produtosordemconsumo.qtdordemconsumo,0) > 0  THEN 
           ( COALESCE(produtosdistribuicao_transfquente_entrada,0) + COALESCE(produtosdistribuicao_qtdquente,0) ) * 
           COALESCE(produtos_qtddoses,0) * TRUNCATE((1 / produtos_qtddoses_total),3) 
           - ( COALESCE(produtosdistribuicao_transfquente,0) + COALESCE(produtosdistribuicao_qtdsaidas,0) ) 
         ELSE 
           ( COALESCE(produtosdistribuicao_transfquente_entrada,0) + COALESCE(produtosdistribuicao_qtdquente,0) ) - 
           ( COALESCE(produtosdistribuicao_transfquente,0) + COALESCE(produtosdistribuicao_qtdsaidas,0) ) 
         END AS saldoquente, 

         CASE WHEN COALESCE(produtosordemconsumo.qtdordemconsumo,0) > 0  THEN 
           ( COALESCE(produtosdistribuicao_transfgelado_entrada,0) + COALESCE(produtosdistribuicao_qtdgelado,0) ) * 
           COALESCE(produtos_qtddoses,0) * TRUNCATE((1 / produtos_qtddoses_total),3) 
           - ( COALESCE(produtosdistribuicao_transfgelado,0) +  COALESCE(produtosdistribuicao_qtdsaidasgelado,0) ) 
         ELSE 
           ( COALESCE(produtosdistribuicao_transfgelado_entrada,0) + COALESCE(produtosdistribuicao_qtdgelado,0)       ) - 
           ( COALESCE(produtosdistribuicao_transfgelado,0)         + COALESCE(produtosdistribuicao_qtdsaidasgelado,0) ) 
         END AS saldogelado ,

        COALESCE(produtosdistribuicao_qtdretiradosdoses, 0) AS produtosdistribuicao_qtdretiradosdoses,
        COALESCE(produtosdistribuicao_qtdretiradosunidades, 0) AS produtosdistribuicao_qtdretiradosunidades,

        (produtosdistribuicao_qtdquente + produtosdistribuicao_qtdgelado + 
        produtosdistribuicao_transfquente_entrada + produtosdistribuicao_transfquente) AS qtddistribuido, 
         
         (produtosdistribuicao_qtdsaidas + produtosdistribuicao_qtdsaidasgelado) +
         (produtosdistribuicao_transfquente + produtosdistribuicao_transfgelado)
         AS quantidadeSaidasDistribuicao

         FROM produtosdistribuicao 
         LEFT JOIN (select produtosordemconsumo_produto, COUNT(*) AS qtdordemconsumo 
         FROM produtosordemconsumo 
         GROUP BY produtosordemconsumo_produto ) produtosordemconsumo ON 
         produtosordemconsumo.produtosordemconsumo_produto  = produtosdistribuicao_produto 

         LEFT JOIN produtos produtos ON produtos.produtos_id = produtosdistribuicao_produto 
         LEFT JOIN pontosentregas ON pontosentregas.pontosentregas_id = produtosdistribuicao.produtosdistribuicao_pontoentrega
         WHERE produtosdistribuicao_produto = ?
         ORDER BY pontosentregas_nome `;

    try {
      const produtos: DistribuicaoListRespostaDto[] =
        await this.repositorio.query(sql, [produto_id]);

      return produtos;
    } catch (error) {
      console.error('Erro ao buscar distribuicoes do produto:', error);
      throw new Error('Erro ao executar a consulta de distribuicoes');
    }
  }
}
