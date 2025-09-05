export class LoginRespostaDto {
  id: number;
  name: string;
  telefone: string | null;
  email: string | null;
  global: boolean;
  admin: boolean;
  tecnico: boolean;
  empresas:
    | [
        {
          nome: string;
          id: number;
        },
      ]
    | null;
  image: string;

  constructor(data: Partial<LoginRespostaDto>) {
    Object.assign(this, data);
  }
}
