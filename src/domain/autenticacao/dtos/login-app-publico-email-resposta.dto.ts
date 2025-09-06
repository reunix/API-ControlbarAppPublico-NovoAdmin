export class LoginAppPublicoEmailRespostaDto {
  usuarioNome: string;

  constructor(data: Partial<LoginAppPublicoEmailRespostaDto>) {
    Object.assign(this, data);
  }
}
