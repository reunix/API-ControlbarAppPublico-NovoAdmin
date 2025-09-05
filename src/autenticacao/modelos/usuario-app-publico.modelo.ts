import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('usersweb')
export class UsuarioAppPublio {
  @PrimaryColumn({ name: 'usersweb_id', type: 'int' })
  id: number;

  @Column({
    name: 'usersweb_nome',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  nome: string | null;

  @Column({
    name: 'usersweb_senha',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  senha: string | null;

  @Column({ name: 'usersweb_cpf', type: 'varchar', length: 20, nullable: true })
  cpf: string | null;
}
