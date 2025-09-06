import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'clientes_id', type: 'int' })
  id: number;

  @Column({ name: 'clientes_nome', type: 'varchar', length: 80 })
  nome: string;

  @Column({ name: 'clientes_razaosocial', type: 'varchar', length: 100 })
  razaoSocial: string;

  @Column({
    name: 'clientes_contato',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  contato: string | null;

  @Column({
    name: 'clientes_cpfcnpj',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  cnpj: string | null;

  @Column({ name: 'clientes_cep', type: 'varchar', length: 9, nullable: true })
  cep: string | null;

  @Column({
    name: 'clientes_endereco',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  endereco: string | null;

  @Column({
    name: 'clientes_numero',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  numero: string | null;

  @Column({
    name: 'clientes_bairro',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bairro: string | null;

  @Column({
    name: 'clientes_cidade',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  cidade: string | null;

  @Column({ name: 'clientes_uf', type: 'varchar', length: 2, nullable: true })
  uf: string | null;

  @Column({
    name: 'clientes_telefone1',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefone1: string | null;

  @Column({
    name: 'clientes_telefone2',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefone2: string | null;

  @Column({
    name: 'clientes_email',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  email: string | null;

  @Column({
    name: 'clientes_datacad',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataCadastro: Date;

  @Column({ name: 'clientes_observacoes', type: 'text', nullable: true })
  observacoes: string | null;

  @Column({ name: 'clientes_ativo', type: 'varchar', length: 1, default: 'N' })
  ativo: string;

  @Column({
    name: 'clientes_valorminimopdv',
    type: 'double',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  valorMinimoPdv: number;

  @Column({
    name: 'clientes_slug_vendas_pre',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  slugVendasPre: string | null;
}
