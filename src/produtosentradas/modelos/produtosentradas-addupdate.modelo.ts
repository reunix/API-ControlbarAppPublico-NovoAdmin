import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('produtoscustos')
export class ProdutoEntradaAddUpdateModelo {
  @PrimaryGeneratedColumn()
  produtoscustos_id: number;

  @Column({ type: 'int', default: 0 })
  produtoscustos_produto: number;

  @Column({ type: 'int', default: 0 })
  produtoscustos_quantidade: number;

  @Column({ type: 'numeric', default: 0 })
  produtoscustos_custo: number;

  @Column({ type: 'numeric', default: 0 })
  produtoscustos_evento: number;

  @Column({ type: 'numeric', default: 0 })
  produtoscustos_fornecedor: number;

  @Column({ type: 'numeric', default: 0 })
  produtoscustos_ordem: number;

  @Column({ type: 'numeric', default: 0 })
  produtoscustos_usuario: number;
}
