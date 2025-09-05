import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProdutosRepositorio } from '../interfaces/produtos-repositorio.interface';
import { ProdutoListAdminRespostaDto } from '../dtos/produtos-list-admin-resposta.dto';
import { ProdutoListAdminDto } from 'produtos/dtos/produtoListAdmin.dto';
import { PontosEntregasListRespostaDto } from 'pontosentregas/dtos/pontosEntregasList-resposta.dto';
import { ProdutosGruposListRespostaDto } from 'produtosgrupos/dtos/produtosGruposList-resposta.dto';
import { ProdutosSubGruposListRespostaDto } from 'produtossubgrupos/dtos/produtosSubgruposList-resposta.dto';

@Injectable()
export class ProdutosListAdminRepositorioImpl implements ProdutosRepositorio {
  constructor(
    @InjectRepository(ProdutoListAdminRespostaDto)
    private readonly repository: Repository<ProdutoListAdminRespostaDto>
    // private readonly repositorioGrupos: Repository<ProdutosGruposListRespostaDto>
  ) {}

  async buscarProdutosListAdmin(
    eventoId: string,
    clienteId: string,
    somenteComAlertas: boolean,
    somenteComEntradas: boolean,
    recuperarDadosAgregados: boolean
  ): Promise<ProdutoListAdminRespostaDto> {
    // alternatica 3
    const sql = ` WITH comp AS (
    SELECT produtoscomposicao_produto, COUNT(*) AS itenscomposicao
    FROM produtoscomposicao
    GROUP BY produtoscomposicao_produto
    ),
    comp_principal AS (
    SELECT produtoscomposicao_produtoprincipal, COUNT(*) AS itenscompostos
    FROM produtoscomposicao
    GROUP BY produtoscomposicao_produtoprincipal
    ),
    ordem AS (
    SELECT produtosordemconsumo_produto, COUNT(*) AS qtdordemconsumo
    FROM produtosordemconsumo
    GROUP BY produtosordemconsumo_produto
    ),
    distribuicao AS (
    SELECT
    produtosdistribuicao_produto,
    SUM(produtosdistribuicao_qtdquente + produtosdistribuicao_qtdgelado) AS qtddistribuido,
    SUM(produtosdistribuicao_qtdretiradosdoses) AS qtdretiradasdose,
    SUM(produtosdistribuicao_qtdsaidas + produtosdistribuicao_qtdsaidasgelado) AS qtdsaidas
    FROM produtosdistribuicao
    GROUP BY produtosdistribuicao_produto
    )
    SELECT
    produtos_nome,
    produtos_venda_online,
    produtos_grupo,
    produtos_subgrupo,
    produtos_exibe_no_imobilizado,
    produtos_tipo,
    produtos_notificacao_estoque,
    produtos_retirada_automatica_na_entrada,
    produtos_percentualalerta,
    produtos_impressao_preparo,
    produtos_id,
    produtos_evento,
    produtos_itemdevenda,
    produtos_gelado,
    produtos_valor,
    produtos_ml,
    produtos_valorweb,
    # COALESCE(produtos_ponto_processo, 0) AS produtos_ponto_processo,
    COALESCE(produtos_ponto_processo, '') AS produtos_ponto_processo,
    produtos_qtddoses_total,
    produtos_qtddoses,
    COALESCE(produtos_qtdentradas, 0) AS produtos_qtdentradas,
    COALESCE(pontosentregas.pontosentregas_nome, '') AS nomePontoPreparo,
    COALESCE(pontosentregasProcesso.pontosentregas_nome, '') AS nomePontoProdutoProcessado,
    CASE WHEN produtos_tipo = 'P' THEN 'Unitário' ELSE 'Composto' END AS produtos_tipo_nome,
    COALESCE(produtos_qtdvendido, 0) AS produtos_qtdvendido,
    CASE
    WHEN COALESCE(produtos_ml, 0) > 0 AND COALESCE(produtos_qtddoses_total, 0) > 0
    THEN CONCAT('Dosagem: ', (produtos_ml / produtos_qtddoses_total), 'ml')
    ELSE ''
    END AS dose_ml,
    COALESCE(comp.itenscomposicao, 0) AS itenscomposicao,
    COALESCE(comp_principal.itenscompostos, 0) AS itenscompostos,
    COALESCE(ordem.qtdordemconsumo, 0) AS qtdordemconsumo,
    COALESCE(distribuicao.qtddistribuido, 0) AS qtddistribuido,
    COALESCE(distribuicao.qtdretiradasdose, 0) AS qtdretiradasdose,
    COALESCE(distribuicao.qtdsaidas, 0) AS qtdsaidas,
    COALESCE(
    (COALESCE(produtos_qtdentradas, 0) * COALESCE(produtos_qtddoses, 0)) / NULLIF(produtos_qtddoses_total, 0),
    0
    ) AS qtdosesdisponivel,
    CASE
    WHEN COALESCE(ordem.qtdordemconsumo, 0) > 0 THEN
    ((COALESCE(produtos_qtdentradas, 0) * COALESCE(produtos_qtddoses, 0)) / NULLIF(produtos_qtddoses_total, 0) - COALESCE(produtos_qtdvendido, 0))
    ELSE
    (COALESCE(produtos_qtdentradas, 0) - COALESCE(produtos_qtdvendido, 0))
    END AS qtdestoque,
    produtosgrupos_nome AS nomegrupo,
    produtossubgrupos_nome AS nomesubgrupo,
    CASE
    WHEN produtosbase_imagem IS NULL OR produtosbase_imagem = '' THEN ''
    ELSE CONCAT(LOWER(produtosbase_imagem), '.jpeg')
    END AS imagem
    FROM produtos
    LEFT JOIN pontosentregas    ON pontosentregas.pontosentregas_id = produtos_ponto_preparo
    LEFT JOIN pontosentregas pontosentregasProcesso ON pontosentregasProcesso.pontosentregas_id = produtos_ponto_processo
    LEFT JOIN produtosgrupos    ON produtos.produtos_grupo = produtosgrupos.produtosgrupos_id
    LEFT JOIN produtossubgrupos ON produtos.produtos_subgrupo = produtossubgrupos.produtossubgrupos_id
    LEFT JOIN produtosbase      ON produtosbase_id = produtos_produtobase
#    LEFT JOIN eventos           ON produtos_evento = eventos_id
#    LEFT JOIN clientes          ON eventos_cliente = clientes_id
    LEFT JOIN comp              ON comp.produtoscomposicao_produto = produtos.produtos_id
    LEFT JOIN comp_principal    ON comp_principal.produtoscomposicao_produtoprincipal = produtos.produtos_id
    LEFT JOIN ordem             ON ordem.produtosordemconsumo_produto = produtos.produtos_id
    LEFT JOIN distribuicao      ON distribuicao.produtosdistribuicao_produto = produtos.produtos_id
    WHERE produtos.produtos_evento = ?
    ${somenteComAlertas ? 'AND ((100 - (produtos_qtdvendido * 100) / NULLIF(produtos_qtdentradas, 0)) <= produtos_percentualalerta)' : ''}
    ${somenteComEntradas ? 'AND (produtos_qtdentradas > 0)' : ''}
    ORDER BY produtos_tipo, produtos_nome `;

    try {
      const produtos: ProdutoListAdminDto[] = await this.repository.query(sql, [
        eventoId,
      ]);

      // const idCliente = produtos[0].clientes_id;

      let grupos: ProdutosGruposListRespostaDto[] = [];
      let subgrupos: ProdutosSubGruposListRespostaDto[] = [];
      let pontosPreparoImpressao: PontosEntregasListRespostaDto[] = [];
      let pontosProcesso: PontosEntregasListRespostaDto[] = [];

      if (recuperarDadosAgregados) {
        const sqlGrupos = `SELECT produtosgrupos_id , produtosgrupos_nome FROM produtosgrupos  
        WHERE produtosgrupos_cliente = ?  ORDER BY produtosgrupos_nome `;
        grupos = await this.repository.query(sqlGrupos, [clienteId]);

        const sqlSubGrupos = `SELECT produtossubgrupos_id , produtossubgrupos_nome FROM produtossubgrupos 
         WHERE produtossubgrupos_CLIENTE = ? ORDER BY produtossubgrupos_nome `;
        subgrupos = await this.repository.query(sqlSubGrupos, [clienteId]);

        const sqlPontoImpressao = `SELECT pontosentregas_id , pontosentregas_nome  FROM pontosentregas 
          LEFT JOIN setores ON setores_id = pontosentregas_setor 
          WHERE setores_evento = ?  AND pontosentregas_preparo = 'S' `;
        pontosPreparoImpressao = await this.repository.query(
          sqlPontoImpressao,
          [eventoId]
        );

        const sqlPontoPreparo = `SELECT pontosentregas_id ,pontosentregas_nome FROM pontosentregas 
        LEFT JOIN setores ON setores_id = pontosentregas_setor 
        WHERE setores_evento = ? AND pontosentregas_preparo = 'N' `;
        pontosProcesso = await this.repository.query(sqlPontoPreparo, [
          eventoId,
        ]);
      }

      return new ProdutoListAdminRespostaDto({
        produtos,
        produtosAgregados: {
          grupos,
          subgrupos,
          pontosPreparoImpressao,
          pontosProcesso,
        },
      });
    } catch (error) {
      console.error('Erro ao buscar produtos do evento:', error);
      throw new Error('Erro ao executar a consulta de produtos do evento');
    }
  }

  // alternativa 2
  // const sql = `
  //   -- Consulta para listar produtos administrativos com informações de estoque e distribuição
  //   SELECT
  //     -- Informações básicas do produto
  //     produtos_nome,
  //     produtos_venda_online,
  //     produtos_grupo,
  //     produtos_subgrupo,
  //     produtos_exibe_no_imobilizado,
  //     produtos_tipo,
  //     clientes_id,
  //     produtos_notificacao_estoque,
  //     produtos_retirada_automatica_na_entrada,
  //     produtos_percentualalerta,
  //     produtos_impressao_preparo,
  //     produtos_id,
  //     produtos_evento,
  //     produtos_itemdevenda,
  //     produtos_gelado,
  //     produtos_valor,
  //     produtos_valorweb,
  //     COALESCE(produtos_ponto_processo, 0) AS produtos_ponto_processo,
  //     produtos_qtddoses_total,
  //     produtos_qtddoses,
  //     COALESCE(produtos_qtdentradas, 0) AS produtos_qtdentradas,
  //     -- Nomes de pontos de entrega
  //     COALESCE(pontosentregas.pontosentregas_nome, '') AS nomePontoPreparo,
  //     COALESCE(pontosentregasProcesso.pontosentregas_nome, '') AS nomePontoProdutoProcessado,
  //     -- Tipo do produto formatado
  //     CASE WHEN produtos_tipo = 'P' THEN 'Unitário' ELSE 'Composto' END AS produtos_tipo_nome,
  //     -- Quantidade vendida
  //     COALESCE(produtos_qtdvendido, 0) AS produtos_qtdvendido,
  //     -- Dosagem em ml
  //     CASE
  //       WHEN COALESCE(produtos_ml, 0) > 0 AND COALESCE(produtos_qtddoses_total, 0) > 0
  //       THEN CONCAT('Dosagem: ', (produtos_ml / produtos_qtddoses_total), 'ml')
  //       ELSE ''
  //     END AS dose_ml,
  //     -- Contagem de composições
  //     COALESCE(comp.itenscomposicao, 0) AS itenscomposicao, -- Contagem de itens na composição do produto
  //     COALESCE(comp_principal.itenscompostos, 0) AS itenscompostos, -- Contagem de produtos compostos
  //     COALESCE(ordem.qtdordemconsumo, 0) AS qtdordemconsumo, -- Contagem de ordens de consumo
  //     COALESCE(distribuicao.qtddistribuido, 0) AS qtddistribuido, -- Soma de quantidades distribuídas (quente + gelado)
  //     -- Distribuição
  //     COALESCE(distribuicao.qtdretiradasdose, 0) AS qtdretiradasdose,
  //     COALESCE(distribuicao.qtdsaidas, 0) AS qtdsaidas,
  //     -- Estoque disponível
  //     COALESCE(
  //       (COALESCE(produtos_qtdentradas, 0) * COALESCE(produtos_qtddoses, 0)) / NULLIF(produtos_qtddoses_total, 0),
  //       0
  //     ) AS qtdosesdisponivel,
  //     -- Estoque final
  //     CASE
  //       WHEN COALESCE(ordem.qtdordemconsumo, 0) > 0 THEN
  //         ((COALESCE(produtos_qtdentradas, 0) * COALESCE(produtos_qtddoses, 0)) / NULLIF(produtos_qtddoses_total, 0) - COALESCE(produtos_qtdvendido, 0))
  //       ELSE
  //         (COALESCE(produtos_qtdentradas, 0) - COALESCE(produtos_qtdvendido, 0))
  //     END AS qtdestoque,
  //     -- Grupos e subgrupos
  //     produtosgrupos_nome AS nomegrupo,
  //     produtossubgrupos_nome AS nomesubgrupo,
  //     -- Imagem
  //     CASE
  //       WHEN produtosbase_imagem IS NULL OR produtosbase_imagem = '' THEN ''
  //       ELSE CONCAT(LOWER(produtosbase_imagem), '.jpeg')
  //     END AS imagem
  //   FROM produtos
  //   -- Junções
  //   LEFT JOIN pontosentregas ON pontosentregas.pontosentregas_id = produtos_ponto_preparo
  //   LEFT JOIN pontosentregas pontosentregasProcesso ON pontosentregasProcesso.pontosentregas_id = produtos_ponto_processo
  //   LEFT JOIN produtosgrupos ON produtos.produtos_grupo = produtosgrupos.produtosgrupos_id
  //   LEFT JOIN produtossubgrupos ON produtos.produtos_subgrupo = produtossubgrupos.produtossubgrupos_id
  //   LEFT JOIN produtosbase ON produtosbase_id = produtos_produtobase
  //   LEFT JOIN eventos ON produtos_evento = eventos_id
  //   LEFT JOIN clientes ON eventos_cliente = clientes_id
  //   -- Agregações
  //   LEFT JOIN (
  //     SELECT
  //       produtoscomposicao_produto,
  //       COUNT(*) AS itenscomposicao
  //     FROM produtoscomposicao
  //     GROUP BY produtoscomposicao_produto
  //   ) comp ON comp.produtoscomposicao_produto = produtos.produtos_id
  //   LEFT JOIN (
  //     SELECT
  //       produtoscomposicao_produtoprincipal,
  //       COUNT(*) AS itenscompostos
  //     FROM produtoscomposicao
  //     GROUP BY produtoscomposicao_produtoprincipal
  //   ) comp_principal ON comp_principal.produtoscomposicao_produtoprincipal = produtos.produtos_id
  //   LEFT JOIN (
  //     SELECT
  //       produtosordemconsumo_produto,
  //       COUNT(*) AS qtdordemconsumo
  //     FROM produtosordemconsumo
  //     GROUP BY produtosordemconsumo_produto
  //   ) ordem ON ordem.produtosordemconsumo_produto = produtos.produtos_id
  //   LEFT JOIN (
  //     SELECT
  //       produtosdistribuicao_produto,
  //       SUM(produtosdistribuicao_qtdquente + produtosdistribuicao_qtdgelado) AS qtddistribuido,
  //       SUM(produtosdistribuicao_qtdretiradosdoses) AS qtdretiradasdose,
  //       SUM(produtosdistribuicao_qtdsaidas + produtosdistribuicao_qtdsaidasgelado) AS qtdsaidas
  //     FROM produtosdistribuicao
  //     GROUP BY produtosdistribuicao_produto
  //   ) distribuicao ON distribuicao.produtosdistribuicao_produto = produtos.produtos_id
  //   WHERE produtos.produtos_evento = ?
  //   -- Filtros dinâmicos
  //   ${somenteComAlertas ? 'AND ((100 - (produtos_qtdvendido * 100) / NULLIF(produtos_qtdentradas, 0)) <= produtos_percentualalerta)' : ''}
  //   ${somenteComEntradas ? 'AND (produtos_qtdentradas > 0)' : ''}
  //   GROUP BY produtos_id
  //   ORDER BY produtos_tipo, produtos_nome
  // `;

  //     let sql = ` SELECT
  //     produtos_nome,
  //     produtos_tipo ,
  //     clientes_id,
  //     produtos_notificacao_estoque,
  //     produtos_retirada_automatica_na_entrada,
  //     produtos_percentualalerta,
  //     produtos_impressao_preparo,
  //     produtos_id,
  //     produtos_evento,
  //     produtos_itemdevenda,
  //     produtos_gelado,
  //     produtos_valor,
  //     produtos_valorweb,
  //     COALESCE(produtos_ponto_processo,0)                     AS produtos_ponto_processo,
  //     produtos_qtddoses_total                                 AS produtos_qtddoses_total,
  //     produtos_qtddoses                                       AS produtos_qtddoses,
  //     COALESCE(produtos_qtdentradas,0)                        AS produtos_qtdentradas,
  //     COALESCE(pontosentregas.pontosentregas_nome,'')         AS nomePontoPreparo,
  //     COALESCE(pontosentregasProcesso.pontosentregas_nome,'') AS nomePontoProdutoProcessado,

  //     CASE WHEN produtos_tipo = 'P' THEN
  //       'Unitário'
  //     ELSE
  //       'Composto'
  //     END                                                     AS produtos_tipo_nome,

  //     CASE WHEN COALESCE(produtos_qtddoses,0) > 0  THEN
  //       FORMAT( COALESCE(produtos_qtdvendido, 0), 2)
  //     ELSE
  //       CONVERT(COALESCE(produtos_qtdvendido,0), SIGNED)
  //     END                                                     AS produtos_qtdvendido,

  //     CASE
  //       WHEN COALESCE(produtos_ml, 0) > 0 AND COALESCE(produtos_qtddoses_total, 0) > 0
  //       THEN CONCAT('Dosagem: ', FORMAT((produtos_ml / produtos_qtddoses_total) , 3), 'ml')
  //       ELSE ''
  //     END AS dose_ml ,

  //     COALESCE( (SELECT count(*)
  //     FROM produtoscomposicao
  //     WHERE  produtoscomposicao.produtoscomposicao_produto = produtos.produtos_id
  //     GROUP BY produtoscomposicao_produto),0)                 AS itenscomposicao,

  //     COALESCE( (SELECT count(*)
  //     FROM produtoscomposicao
  //     WHERE  produtoscomposicao.produtoscomposicao_produtoprincipal = produtos.produtos_id
  //     GROUP BY produtoscomposicao_produtoprincipal),0)        AS itenscompostos,

  //     COALESCE( ( SELECT COUNT(*)
  //     FROM produtosordemconsumo
  //     WHERE produtosordemconsumo.produtosordemconsumo_produto  = produtos.produtos_id
  //     GROUP BY produtosordemconsumo_produto ),0)              AS qtdordemconsumo,

  //     COALESCE( ( SELECT SUM(produtosdistribuicao_qtdquente + produtosdistribuicao_qtdgelado)
  //     FROM produtosdistribuicao
  //     WHERE produtosdistribuicao.produtosdistribuicao_produto = produtos.produtos_id
  //     GROUP BY produtosdistribuicao_produto),0)               AS qtddistribuido,

  //     COALESCE(SUM(pd.produtosdistribuicao_qtdretiradosdoses), 0) AS qtdretiradasdose,
  //     COALESCE(SUM(pd.produtosdistribuicao_qtdretiradosunidades), 0) AS qtdretiradasunidades,
  //     COALESCE(SUM(pd.produtosdistribuicao_qtdsaidas + pd.produtosdistribuicao_qtdsaidasgelado), 0) AS qtdsaidas,

  //   (COALESCE(produtos_qtdentradas, 0) * COALESCE(produtos_qtddoses, 0)) * (1 /   COALESCE(produtos_qtddoses_total, 1)) AS qtdosesdisponivel,

  //     COALESCE(FORMAT(  (COALESCE(produtos_qtdentradas,0) * COALESCE
  //  (produtos_qtddoses,0) ) * TRUNCATE((1 / produtos_qtddoses_total),3)
  //       , 2),0)                                                 AS
  //  qtdosesdisponivel,

  //     CASE WHEN

  //     COALESCE( ( SELECT COUNT(*) AS qtdordemconsumo
  //     FROM produtosordemconsumo
  //     WHERE produtosordemconsumo.produtosordemconsumo_produto  = produtos.produtos_id
  //     GROUP BY produtosordemconsumo_produto ),0) > 0

  //     THEN
  //       (  FORMAT(  (COALESCE(produtos_qtdentradas,0) * COALESCE(produtos_qtddoses,0) ) * TRUNCATE((1 / produtos_qtddoses_total),2)
  //       - COALESCE(produtos_qtdvendido,0) , 2) )
  //     ELSE
  //       ( TRUNCATE(COALESCE(produtos_qtdentradas,0) - COALESCE(produtos_qtdvendido,0), 2) )
  //     END                                                         AS qtdestoque,

  //     produtosgrupos_nome                                         AS nomegrupo,
  //     produtossubgrupos_nome                                      AS nomesubgrupo ,

  //       CASE
  //         WHEN produtosbase_imagem IS NULL OR produtosbase_imagem = '' THEN ''
  //       ELSE
  //         CONCAT(LOWER(produtosbase_imagem), '.jpeg')
  //     END AS imagem

  //     FROM produtos

  //     LEFT JOIN pontosentregas pontosentregas         ON pontosentregas.pontosentregas_id = produtos_ponto_preparo
  //     LEFT JOIN pontosentregas pontosentregasProcesso ON pontosentregasProcesso.pontosentregas_id = produtos_ponto_processo
  //     LEFT JOIN produtosgrupos produtosgrupos         ON produtos.produtos_grupo = produtosgrupos.produtosgrupos_id
  //     LEFT JOIN produtossubgrupos produtossubgrupos   ON produtos.produtos_subgrupo = produtossubgrupos.produtossubgrupos_id
  //     LEFT JOIN produtosdistribuicao pd               ON produtos_id = pd.produtosdistribuicao_produto
  //     LEFT JOIN produtosbase                          ON produtosbase_id = produtos_produtobase
  //     LEFT JOIN eventos                               ON produtos_evento = eventos_id
  //     LEFT JOIN clientes                              ON eventos_cliente = clientes_id

  //     WHERE (produtos.produtos_evento = ?) `;

  //     if (somenteComAlertas) {
  //       // sql += ` AND (  ( 100 - (produtos.produtos_qtdvendido * 100) / COALESCE(produtos_qtdentradas,0))
  //       // <= produtos.produtos_percentualalerta )  `;
  //       sql += ` AND ((100 - (produtos_qtdvendido * 100) / NULLIF(produtos_qtdentradas, 0)) <= produtos_percentualalerta)`;
  //     }

  //     if (somenteComEntradas) {
  //       sql += ` AND (produtos_qtdentradas > 0)  `;
  //     }

  //     sql += `GROUP BY produtos_id
  //     ORDER BY produtos_tipo, produtos_nome
  //     `;

  // console.log(sql);
}
