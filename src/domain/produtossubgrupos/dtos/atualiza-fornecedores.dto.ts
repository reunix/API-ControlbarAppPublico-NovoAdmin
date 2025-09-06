import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AtualizaFornecedorDto {
  @IsInt()
  fornecedores_id: number;

  @IsNotEmpty()
  fornecedores_nome: string;

  @IsInt()
  @Min(0)
  fornecedores_cliente: number;
}

export class AtualizaFornecedoresDto {
  @IsNotEmpty()
  fornecedor: AtualizaFornecedorDto;
}
