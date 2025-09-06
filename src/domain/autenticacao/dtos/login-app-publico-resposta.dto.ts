export class LoginAppPublicoRespostaDto {
  success: boolean;
  message: string;

  constructor(data: Partial<LoginAppPublicoRespostaDto>) {
    Object.assign(this, data);
  }
}
