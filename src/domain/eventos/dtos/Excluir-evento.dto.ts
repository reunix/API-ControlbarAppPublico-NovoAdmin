export class ExcluirEventoAbertoRespostaDto {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  telefone: string;
  cnpj: string;
  telefone1: string;
  email: string;

  constructor(props: Partial<ExcluirEventoAbertoRespostaDto>) {
    Object.assign(this, props);
  }
}
