import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('usuarios')
export class UsuarioAdmin {
  @PrimaryColumn({ name: 'usuarios_id', type: 'int' })
  id: number;

  @Column({ name: 'usuarios_ativo', type: 'tinyint', default: 0 })
  ativo: boolean;

  @Column({
    name: 'usuarios_nomecompleto',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  nome: string | null;

  @Column({ name: 'usuarios_nome', type: 'varchar', length: 45 })
  login: string;

  @Column({
    name: 'usuarios_senha',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  senha: string | null;

  @Column({ name: 'usuarios_cliente', type: 'int', nullable: true })
  cliente: number | null;

  @Column({ name: 'usuarios_evento', type: 'int', nullable: true })
  evento: number | null;

  @Column({
    name: 'usuarios_admin',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  admin: string | null;

  @Column({ name: 'usuarios_qtdvendasabertas', type: 'int', default: 0 })
  qtdVendasAbertas: number;

  @Column({
    name: 'usuarios_creditoconsumo',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  creditoConsumo: number;

  @Column({ name: 'usuarios_pdv', type: 'int', nullable: true })
  pdv: number | null;

  @Column({ name: 'usuarios_moeda', type: 'int', nullable: true })
  moeda: number | null;

  @Column({
    name: 'usuarios_comissao',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  comissao: number;

  @Column({ name: 'usuarios_garcom', type: 'varchar', length: 1, default: 'N' })
  garcom: string;

  @Column({ name: 'usuarios_ultimoacesso', type: 'datetime', nullable: true })
  ultimoAcesso: Date | null;

  @Column({ name: 'usuarios_global', type: 'varchar', length: 1, default: 'N' })
  global: string;

  @Column({
    name: 'usuarios_responsavelbar',
    type: 'varchar',
    length: 1,
    default: 'N',
  })
  responsavelBar: string;

  @Column({
    name: 'usuarios_datacad',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataCadastro: Date;

  @Column({
    name: 'usuarios_atualizarsenha',
    type: 'varchar',
    length: 1,
    default: 'S',
  })
  atualizarSenha: string;

  @Column({ name: 'usuarios_ultimavenda', type: 'int', default: 0 })
  ultimaVenda: number;

  @Column({ name: 'usuarios_tipo', type: 'varchar', length: 1, nullable: true })
  tipo: string | null;

  @Column({
    name: 'usuarios_telefone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefone: string | null;

  @Column({
    name: 'usuarios_pix',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  pix: string | null;

  @Column({ name: 'usuarios_cpf', type: 'varchar', length: 20, nullable: true })
  cpf: string | null;

  @Column({
    name: 'usuarios_email',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  email: string | null;
}
