import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('despesas')
export class DistribuicaoAddUpdateModelo {
  @PrimaryGeneratedColumn()
  despesas_id: number;

  @Column({ default: null })
  despesas_descricao: string;

  @Column({ default: 'O' })
  despesas_tipo: string;

  @Column({ default: 'B' })
  despesas_tipo_despesa: string;

  @Column({ type: 'int', default: 0 })
  despesas_produto: number;

  @Column({ type: 'int', default: 0 })
  despesas_evento: number;

  @Column({ type: 'numeric', default: 0 })
  despesas_valor: number;

  @Column({ type: 'int', default: 0 })
  despesas_quantidade: number;
}
