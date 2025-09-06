import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AtualizaProdutosComposicaoDto {
  @IsOptional()
  @IsInt()
  produtoscomposicao_id?: number;

  @IsInt()
  @Min(0)
  produtoscomposicao_produto: number;

  @IsInt()
  @Min(0)
  produtoscomposicao_produtoprincipal: number;

  @IsInt()
  @Min(0)
  produtoscomposicao_quantidade: number;

  @IsString()
  produtoscomposicao_tipo: string;

  @IsString()
  produtoscomposicao_gelado: string;

  @IsString()
  produtoscomposicao_datacad: string;
}

export class AtualizaProdutosComposicoesDto {
  @IsArray()
  @IsNotEmpty()
  composicoes: AtualizaProdutosComposicaoDto[];
}
