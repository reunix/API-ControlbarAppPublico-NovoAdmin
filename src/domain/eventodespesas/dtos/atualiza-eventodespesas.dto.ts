import { IsArray, IsInt, IsNotEmpty, Min } from 'class-validator';

export class AtualizaEventoDespesaDto {
  @IsInt()
  despesas_id: number;

  @IsNotEmpty()
  despesas_descricao: string;

  @IsNotEmpty()
  despesas_tipo: string;

  @IsNotEmpty()
  despesas_tipo_despesa: string;

  @IsInt()
  @Min(0)
  despesas_produto: number;

  @IsInt()
  @Min(0)
  despesas_evento: number;

  @IsInt()
  @Min(0)
  despesas_valor: number;

  @IsInt()
  @Min(0)
  despesas_quantidade: number;
}

export class AtualizaEventoDespesasDto {
  @IsArray()
  @IsNotEmpty()
  despesas: AtualizaEventoDespesaDto[];
}
