import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('produtoscomposicao')
export class ProdutosComposicaoCrudModelo {
  @PrimaryGeneratedColumn()
  produtoscomposicao_id: number;

  @Column({ type: 'int', default: 0 })
  produtoscomposicao_produto: number;

  @Column({ type: 'int', default: 0 })
  produtoscomposicao_produtoprincipal: number;

  @Column({ type: 'int', default: 0 })
  produtoscomposicao_quantidade: number;

  @Column({ default: 'UNIDADE' })
  produtoscomposicao_tipo: string;

  @Column({ default: 'S' })
  produtoscomposicao_gelado: string;
}
