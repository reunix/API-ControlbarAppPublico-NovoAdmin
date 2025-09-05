import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn({ name: 'eventos_id', type: 'int' })
  id: number;

  @Column({ name: 'eventos_nome', type: 'varchar', length: 50 })
  nome: string;

  @Column({ name: 'eventos_cliente', type: 'int', default: 1 })
  cliente: number;

  @Column({ name: 'eventos_codigo_integracao', type: 'int', default: 0 })
  codigoIntegracao: number;

  @Column({ name: 'eventos_data', type: 'datetime' })
  data: Date;

  @Column({ name: 'eventos_ultimavenda', type: 'datetime', nullable: true })
  ultimaVenda: Date | null;

  @Column({
    name: 'eventos_despesas',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  despesas: number;

  @Column({
    name: 'eventos_servico_ctbar',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  servicoCtbar: number;

  @Column({ name: 'eventos_relatorio', type: 'mediumtext' })
  relatorio: string;

  @Column({
    name: 'eventos_endereco',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  endereco: string | null;

  @Column({
    name: 'eventos_numero',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  numero: string | null;

  @Column({
    name: 'eventos_cidade',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  cidade: string | null;

  @Column({
    name: 'eventos_bairro',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bairro: string | null;

  @Column({
    name: 'eventos_complemento',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  complemento: string | null;

  @Column({ name: 'eventos_uf', type: 'varchar', length: 2, nullable: true })
  uf: string | null;

  @Column({
    name: 'eventos_valorminimo_pdv',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  valorMinimoPdv: number;

  @Column({
    name: 'eventos_valorfichaopenbar',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  valorFichaOpenBar: number;

  @Column({
    name: 'eventos_taxamaquineta',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  taxaMaquineta: number;

  @Column({
    name: 'eventos_finalizado',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  finalizado: string;

  @Column({
    name: 'eventos_permitedevolucao',
    type: 'varchar',
    length: 1,
    default: 'S',
  })
  permiteDevolucao: string;

  @Column({
    name: 'eventos_acumulado_credito_troca',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  acumuladoCreditoTroca: number;

  @Column({ name: 'eventos_publico_estimado', type: 'int', default: 0 })
  publicoEstimado: number;

  @Column({
    name: 'eventos_vendacartao',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  vendaCartao: string;

  @Column({
    name: 'eventos_taxa_cartao_aproximacao',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  taxaCartaoAproximacao: number;

  @Column({
    name: 'eventos_datacad',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataCadastro: Date;

  @Column({
    name: 'eventos_gestaocartaoaproximacao',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  gestaoCartaoAproximacao: string;

  @Column({
    name: 'eventos_pedesenhareimpressao',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  pedeSenhaReimpressao: string;

  @Column({
    name: 'eventos_fd_cx_devolucao_credito',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  fdCxDevolucaoCredito: number;

  @Column({
    name: 'eventos_cartao_aprox_offline',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  cartaoAproxOffline: string;

  @Column({
    name: 'eventos_percentual_garcom',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  percentualGarcom: number;

  @Column({
    name: 'eventos_permite_notificacoes',
    type: 'varchar',
    length: 1,
    default: 'S',
  })
  permiteNotificacoes: string;

  @Column({ name: 'eventos_imagem', type: 'varchar', length: 50 })
  imagem: string;

  @Column({
    name: 'eventos_maquinetas_por_atendente',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  maquinasPorAtendente: string;

  @Column({
    name: 'eventos_controla_garcom',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  controlaGarcom: string;

  @Column({
    name: 'eventos_restaurante',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  restaurante: string;

  @Column({
    name: 'eventos_vendas_online',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  vendasOnline: string;

  @Column({
    name: 'eventos_acrescimo_pix',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  acrescimoPix: number;

  @Column({ name: 'eventos_qtd_max_parcelas', type: 'int', default: 1 })
  qtdMaxParcelas: number;

  @Column({
    name: 'eventos_verifica_conexao',
    type: 'varchar',
    length: 1,
    default: 'S',
  })
  verificaConexao: string;
}
