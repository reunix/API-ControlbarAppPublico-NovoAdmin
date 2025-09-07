import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('usersweb')
export class UsuarioAppPublico {
  @PrimaryColumn({ name: 'usersweb_id', type: 'int' })
  usersweb_id: number;

  @Column({
    name: 'usersweb_nome',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  usersweb_nome: string;

  @Column({
    name: 'usersweb_email',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  usersweb_email: string;

  @Column({
    name: 'usersweb_senha',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  usersweb_senha: string;

  @Column({
    name: 'usersweb_estado',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  usersweb_estado: string;

  @Column({
    name: 'usersweb_cpf',
    type: 'varchar',
    length: 11,
    nullable: true,
  })
  usersweb_cpf: string;

  @Column({
    name: 'usersweb_cep',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  usersweb_cep: string;

  @Column({
    name: 'usersweb_endereco',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  usersweb_endereco: string;

  @Column({
    name: 'usersweb_complemento',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  usersweb_complemento: string;

  @Column({
    name: 'usersweb_cidade',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  usersweb_cidade: string;

  @Column({
    name: 'usersweb_bairro',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  usersweb_bairro: string;

  @Column({
    name: 'usersweb_numero',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  usersweb_numero: string;

  @Column({
    name: 'usersweb_ddd',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  usersweb_ddd: string;

  @Column({
    name: 'usersweb_telefone',
    type: 'varchar',
    length: 9,
    nullable: true,
  })
  usersweb_telefone: string;
}
