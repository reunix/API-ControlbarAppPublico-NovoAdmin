import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fornecedores')
export class FornecedorModel {
  @PrimaryGeneratedColumn()
  fornecedores_id: number;

  @Column()
  fornecedores_nome: string;

  @Column({ type: 'int', default: 0 })
  fornecedores_cliente: number;
}
