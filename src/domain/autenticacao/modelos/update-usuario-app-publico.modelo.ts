import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('usersweb')
export class UpdateUsuarioAppPublio {
  @PrimaryColumn({ name: 'usersweb_id', type: 'int' })
  usersweb_id: number;

  @Column({
    name: 'usersweb_nome',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  usersweb_nome: string | null;

  @Column({
    name: 'usersweb_senha',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  usersweb_senha: string | null;

  @Column({
    name: 'usersweb_email',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  usersweb_email: string | null;

  @Column({ name: 'usersweb_cpf', type: 'varchar', length: 20, nullable: true })
  cpf: string | null;
}
