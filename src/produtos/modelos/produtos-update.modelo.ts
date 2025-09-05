import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('produtos')
export class ProdutoModel {
  @PrimaryGeneratedColumn()
  produtos_id: number;

  // @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  // produtos_datacad: Date;

  @Column({ type: 'varchar', length: 50, nullable: false })
  produtos_nome: string;

  @Column({ type: 'int', nullable: false })
  produtos_evento: number;

  @Column({ type: 'int', nullable: true })
  produtos_produtobase: number;

  @Column({
    type: 'double',
    precision: 12,
    scale: 3,
    nullable: false,
    default: 0.0,
  })
  produtos_qtdvendido: number;

  @Column({
    type: 'double',
    precision: 12,
    scale: 3,
    nullable: false,
    default: 0.0,
  })
  produtos_qtdentradas: number;

  @Column({ type: 'int', nullable: false })
  produtos_grupo: number;

  @Column({ type: 'int', nullable: true })
  produtos_subgrupo: number;

  @Column({ type: 'int', nullable: true })
  produtos_ponto_preparo: number;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'S' })
  produtos_itemdevenda: string;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'N' })
  produtos_gelado: string;

  @Column({
    type: 'double',
    precision: 12,
    scale: 2,
    nullable: false,
    default: 0.0,
  })
  produtos_valor: number;

  @Column({
    type: 'double',
    precision: 12,
    scale: 2,
    nullable: false,
    default: 0.0,
  })
  produtos_valorweb: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  produtos_percentualalerta: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  produtos_qtddoses: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  produtos_qtddoses_total: number;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'P' })
  produtos_tipo: string;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'N' })
  produtos_exibe_no_imobilizado: string;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'N' })
  produtos_impressao_preparo: string;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'S' })
  produtos_notificacao_estoque: string;

  @Column({
    type: 'double',
    precision: 12,
    scale: 3,
    nullable: false,
    default: 0.0,
  })
  produtos_ml: number;

  @Column({ type: 'int', nullable: true })
  produtos_ponto_processo: number;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'N' })
  produtos_retirada_automatica_na_entrada: string;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'N' })
  produtos_venda_online: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  produtos_unidade_medida: string;
}
