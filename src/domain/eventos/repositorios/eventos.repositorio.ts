import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventosRepositorio } from '../interfaces/eventos-repositorio.interface';
import { EventoAbertosRespostaDto } from '../dtos/eventosAbertos-resposta.dto';
import {
  FormaPagtoParamsAppVendasPublico,
  ProdutoParamsAppVendasPublico,
  RespostaParamsAppVendasPublico,
} from '../dtos/params-app-vendas-publico-resposta.dto';
import { EventosAbertosAppVendasPublico } from '../dtos/eventos-abertos-app-publico-resposta.dto';

@Injectable()
export class EventosRepositorioImpl implements EventosRepositorio {
  constructor(
    @InjectRepository(EventoAbertosRespostaDto)
    private readonly repositorio: Repository<EventoAbertosRespostaDto>
  ) {}

  async buscarParmsLoginAppPublico(
    idEvento: number
  ): Promise<RespostaParamsAppVendasPublico> {
    const sqlProdutos = `SELECT 
    produtos_id         AS idProduto,
    produtos_nome       AS nomeProduto,
    produtosgrupos_nome AS grupoProduto,
    'nome_imaem'        AS imagemProduto,
    produtos_valor      AS valorProduto
    FROM produtos 
    LEFT JOIN produtosgrupos on produtosgrupos_id = produtos_grupo
    WHERE produtos_itemdevenda = 'S' AND produtos_evento = ${idEvento}
    ORDER BY produtosgrupos_nome , produtos_nome `;

    const sqlFormasPagto = ` SELECT formaspagto_nome AS nomeFormapagto , formaspagto_id AS idFormapagto 
    FROM formaspagto
    WHERE formaspagto_evento = ${idEvento} AND 
    (formaspagto_tiporecebimento = 1 OR formaspagto_tiporecebimento = 2 OR formaspagto_tiporecebimento = 5)
    ORDER BY formaspagto_nome
    `;

    try {
      const [produtos, formasPagto]: [
        ProdutoParamsAppVendasPublico[],
        FormaPagtoParamsAppVendasPublico[],
      ] = await this.repositorio.query(sqlProdutos + ' ; ' + sqlFormasPagto);

      const resposta: RespostaParamsAppVendasPublico = {
        produtos,
        formaspagto: formasPagto,
      };

      return resposta;
    } catch (error) {
      console.error('Erro ao buscar parâmetros app vendas publico:', error);
      throw new Error(
        'Erro ao executar a consulta de parâmetros app vendas publico'
      );
    }
  }

  async buscarEventosAbertos(): Promise<EventoAbertosRespostaDto[]> {
    const sql = `SELECT 
    e.eventos_id ,
    e.eventos_nome,
    e.eventos_vendacartao,
    e.eventos_controla_garcom,
    e.eventos_restaurante,
    c.clientes_cpfcnpj,
    c.clientes_nome,
    c.clientes_id,
    e.eventos_vendas_online,
    IFNULL(e.eventos_endereco, '') AS eventos_endereco,
    IFNULL(e.eventos_cidade, '') AS eventos_cidade,
    IFNULL(e.eventos_bairro, '') AS eventos_bairro,
    IFNULL(e.eventos_numero, '') AS eventos_numero,
    IFNULL(e.eventos_uf, '') AS eventos_uf,
    CASE 
        WHEN e.eventos_vendacartao = 'N' THEN 'Fichas'
        WHEN e.eventos_vendacartao = 'C' THEN 'Crédito Cartão'
        WHEN e.eventos_vendacartao = 'P' THEN 'Produto Cartão'
        ELSE 'Modo Inválido'
    END AS eventos_tipo,
    
    CASE 
        WHEN eventos_imagem IS NULL OR eventos_imagem = '' THEN ''
      ELSE 
        CONCAT(LOWER(eventos_imagem), '.jpeg')
    END AS eventos_imagem,

    COALESCE((
        SELECT COUNT(*) 
        FROM pdvs p
        JOIN setores s ON s.setores_id = p.pdvs_setor 
        WHERE s.setores_evento = e.eventos_id
    ), 0) AS qtdPdvs,
    COALESCE((
        SELECT COUNT(*) 
        FROM pontosentregas pe
        JOIN setores s ON s.setores_id = pe.pontosentregas_setor 
        WHERE s.setores_evento = e.eventos_id
    ), 0) AS qtdBeeps,
    (SELECT DATE_FORMAT(eh.eventoshead_data, '%d/%m/%Y %H:%i') 
     FROM eventoshead eh 
     WHERE eh.eventoshead_evento = e.eventos_id 
     ORDER BY eh.eventoshead_data DESC 
     LIMIT 1) AS ultimavenda,
    DATE_FORMAT(e.eventos_data, '%d/%m/%Y %H:%i') AS data,
    COALESCE((
        SELECT COUNT(*) 
        FROM produtos p 
        WHERE p.produtos_evento = e.eventos_id
        AND p.produtos_qtdentradas > 0 
        AND p.produtos_qtdvendido > 0 
        AND (ROUND(100 - (p.produtos_qtdvendido * 100) / p.produtos_qtdentradas, 2)) <= p.produtos_percentualalerta
    ), 0) AS qtdProdsAlertaVendas
    FROM eventos e
    LEFT JOIN clientes c ON c.clientes_id = e.eventos_cliente
    WHERE e.eventos_finalizado = 'N'
    ORDER BY ultimavenda DESC, e.eventos_data;`;

    try {
      const eventos: EventoAbertosRespostaDto[] = await this.repositorio.query(
        sql,
        []
      );

      return eventos;
    } catch (error) {
      console.error('Erro ao buscar eventos abertos:', error);
      throw new Error('Erro ao executar a consulta de eventos abertos');
    }
  }

  async buscarEventosAbertosAppPublico(): Promise<
    EventosAbertosAppVendasPublico[]
  > {
    const sql = `SELECT 
    eventos_id          AS idEvento ,
    eventos_nome        AS nomeEvento,
    eventos_latitude    AS latitude,
    eventos_longitude   AS longitude,
    CONCAT(eventos_endereco,', ',eventos_numero,', ',eventos_bairro,', ',eventos_cidade) AS enderecoCompleto,
    clientes_nome       AS nomeCliente,
    (eventos_autopagto_app = 'S') AS autopagto,
    
    # CASE
    #  WHERE eventos_autopagto_app = 'S THEN true
    # ELSE
    #   false
    # END AS autopagto,

    CASE 
        WHEN eventos_imagem IS NULL OR eventos_imagem = '' THEN ''
      ELSE 
        CONCAT(LOWER(eventos_imagem), '.jpeg')
    END AS imagemEvento

    FROM eventos 
    LEFT JOIN clientes c ON c.clientes_id = eventos_cliente
    WHERE eventos_finalizado = 'N' AND eventos_latitude IS NOT NULL
    ORDER BY eventos_nome `;

    try {
      const eventos: EventosAbertosAppVendasPublico[] =
        await this.repositorio.query(sql, []);
      return eventos;
    } catch (error) {
      console.error('Erro ao buscar eventos abertos:', error);
      throw new Error('Erro ao executar a consulta de eventos abertos');
    }
  }
}
