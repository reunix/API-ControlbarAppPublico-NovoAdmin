import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fornecedores')
export class FornecedorAddUpdateModelo {
  @PrimaryGeneratedColumn()
  fornecedores_id: number;

  @Column({ default: null })
  fornecedores_nome: string;

  @Column({ type: 'int', default: 0 })
  fornecedores_cliente: number;
}
