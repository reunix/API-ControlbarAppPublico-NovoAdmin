import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class AtualizaProdutosEntradaDto {
  @IsOptional()
  @IsInt()
  produtoscustos_id?: number;

  @IsInt()
  @Min(0)
  produtoscustos_produto: number;

  @IsInt()
  @Min(0)
  produtoscustos_quantidade: number;

  @IsNumber()
  @Min(0)
  produtoscustos_custo: number;

  @IsNumber()
  @Min(0)
  produtoscustos_evento: number;

  @IsNumber()
  @Min(0)
  produtoscustos_fornecedor: number;

  @IsNumber()
  @Min(0)
  produtoscustos_ordem: number;

  @IsNumber()
  @Min(0)
  produtoscustos_usuario: number;
}

export class AtualizaProdutosEntradasDto {
  @IsArray()
  @IsNotEmpty()
  entradas: AtualizaProdutosEntradaDto[];
}
