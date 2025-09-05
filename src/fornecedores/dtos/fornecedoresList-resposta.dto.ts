export class FornecedorListRespostaDto {
  fornecedores_id: number;
  fornecedores_nome: string;
  fornecedores_evento: number;

  constructor(data: Partial<FornecedorListRespostaDto>) {
    Object.assign(this, data);
  }
}
