export class ClienteRespostaDto {
  id: number;
  nome: string;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  telefone: string | null;
  cnpj: string | null;
  email: string | null;
  constructor(data: Partial<ClienteRespostaDto>) {
    Object.assign(this, data);
  }
}
