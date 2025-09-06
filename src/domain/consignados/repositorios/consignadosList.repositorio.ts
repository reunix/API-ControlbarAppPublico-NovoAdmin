import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consignado } from '../modelos/consignado.modelo';

import { ConsignadosListRepositorio } from '../interfaces/consignados-list-repositorio.interface';
import { ConsignadosListRespostaDto } from '../dtos/consignadosList-resposta.dto';

@Injectable()
export class ConsignadosListRepositorioImpl
  implements ConsignadosListRepositorio
{
  constructor(
    @InjectRepository(Consignado)
    private readonly repositorio: Repository<Consignado>
  ) {}

  async buscarProdutosParaConsignados(
    eventoId: number
  ): Promise<ConsignadosListRespostaDto[]> {
    const sql = `
      SELECT produtos_nome AS produtoNome, 
      produtos_id AS produtoId,  
      produtos_evento, 
      COALESCE(produtos_qtdentradas,0) AS qtdEntradas, 

      COALESCE(consignados.consigdevolvidos_diferenca,0) AS qtdDiferenca, 
      COALESCE(consignados.consigdevolvidos_id,0) AS consignado_id, 
      COALESCE(consignados.consigdevolvidos_qtd,0) AS devolucaoFornecedor, 
      COALESCE(consignados.consigdevolvidos_qtdreal,0) AS devolucaoBar, 

      COALESCE( 
      (SELECT 

      SUM( CEIL(produtosdistribuicao_qtdsaidas) + CEIL(produtosdistribuicao_qtdsaidasgelado) ) 
      FROM produtosdistribuicao 
      WHERE produtosdistribuicao_produto = produtos_id 
      GROUP BY produtosdistribuicao_produto),0) AS qtdSaidas
      FROM produtos 

      LEFT JOIN (SELECT consigdevolvidos_id, consigdevolvidos_produto, consigdevolvidos_diferenca, 
      consigdevolvidos_qtd, consigdevolvidos_qtdreal 
      FROM consigdevolvidos )  
      consignados ON consignados.consigdevolvidos_produto = produtos_id 

      WHERE produtos_evento = ? AND COALESCE(produtos_qtdentradas,0) > 0 
      ORDER BY produtos_nome `;

    try {
      const produtos: ConsignadosListRespostaDto[] =
        await this.repositorio.query(sql, [eventoId]);

      const produtosComSaldo = produtos.map((produtos) => ({
        ...produtos,
        saldo: produtos.qtdEntradas - produtos.qtdSaidas,
      }));

      return produtosComSaldo;
    } catch (error) {
      console.error('Erro ao buscar produtos consignados:', error);
      throw new Error('Erro ao executar a consulta produtos consignados');
    }
  }
}
