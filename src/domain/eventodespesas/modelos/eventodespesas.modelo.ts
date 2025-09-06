import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('despesas')
export class EventoDepesas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  produtoId: number;

  @Column()
  produtoNome: string;

  @Column({ type: 'int', default: 0 })
  qtdEntradas: number;

  @Column({ type: 'int', default: 0 })
  qtdSaidas: number;

  @Column({ type: 'int', default: 0 })
  saldo: number;

  @Column({ type: 'int', default: 0 })
  devolucaoBar: number;

  @Column({ type: 'int', default: 0 })
  devolucaoFornecedor: number;
}
