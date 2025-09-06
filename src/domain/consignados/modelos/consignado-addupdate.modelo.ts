import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('consigdevolvidos')
export class ConsignadoAddUpdateModelo {
  @PrimaryGeneratedColumn()
  consigdevolvidos_id: number;

  @Column({ type: 'int', default: 0 })
  consigdevolvidos_produto: number;

  @Column({ type: 'int', default: 0 })
  consigdevolvidos_evento: number;

  @Column({ type: 'int', default: 0 })
  consigdevolvidos_qtd: number;

  @Column({ type: 'int', default: 0 })
  consigdevolvidos_qtdreal: number;
}
