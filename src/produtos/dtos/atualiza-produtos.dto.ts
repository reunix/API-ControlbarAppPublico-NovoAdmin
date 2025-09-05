import {
  IsString,
  IsInt,
  IsNumber,
  IsNotEmpty,
  Min,
  IsOptional,
  MaxLength,
  IsIn,
} from 'class-validator';

export class ProdutoCrudDto {
  @IsInt()
  @IsOptional()
  produtos_id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Nome do produto é obrigatório.' })
  @MaxLength(50, {
    message: 'Nome do produto deve ter no máximo 50 caracteres.',
  })
  produtos_nome: string;

  @IsInt()
  @IsNotEmpty({ message: 'Evento é obrigatório.' })
  produtos_evento: number;

  @IsInt()
  @IsOptional()
  produtos_produtobase?: number;

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @Min(0, { message: 'Quantidade vendida deve ser maior ou igual a 0.' })
  @IsOptional()
  produtos_qtdvendido?: number;

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @Min(0, { message: 'Quantidade de entradas deve ser maior ou igual a 0.' })
  @IsOptional()
  produtos_qtdentradas?: number;

  @IsInt()
  @IsNotEmpty({ message: 'Grupo é obrigatório.' })
  produtos_grupo: number;

  @IsInt()
  @IsOptional()
  produtos_subgrupo?: number;

  @IsInt()
  @IsOptional()
  produtos_ponto_preparo?: number;

  @IsString()
  @IsIn(['S', 'N'], { message: 'Item de venda deve ser "S" ou "N".' })
  @IsNotEmpty({ message: 'Item de venda é obrigatório.' })
  produtos_itemdevenda: string;

  @IsString()
  @IsIn(['S', 'N'], { message: 'Gelado deve ser "S" ou "N".' })
  @IsNotEmpty({ message: 'Tipo (gelado/quente) é obrigatório.' })
  produtos_gelado: string;

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0, { message: 'Valor do produto deve ser maior ou igual a 0.' })
  @IsNotEmpty({ message: 'Valor do produto é obrigatório.' })
  produtos_valor: number;

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0, { message: 'Valor web deve ser maior ou igual a 0.' })
  @IsNotEmpty({ message: 'Valor web é obrigatório.' })
  produtos_valorweb: number;

  @IsInt()
  @Min(0, { message: 'Percentual de alerta deve ser maior ou igual a 0.' })
  @IsNotEmpty({ message: 'Percentual de alerta é obrigatório.' })
  produtos_percentualalerta: number;

  @IsInt()
  @Min(0, { message: 'Quantidade de doses deve ser maior ou igual a 0.' })
  @IsNotEmpty({ message: 'Quantidade de doses é obrigatório.' })
  produtos_qtddoses: number;

  @IsInt()
  @Min(0, { message: 'Quantidade total de doses deve ser maior ou igual a 0.' })
  @IsNotEmpty({ message: 'Quantidade total de doses é obrigatório.' })
  produtos_qtddoses_total: number;

  @IsString()
  @IsIn(['P', 'S', 'C'], { message: 'Tipo deve ser "P", "S" ou "C".' })
  @IsNotEmpty({ message: 'Tipo do produto é obrigatório.' })
  produtos_tipo: string;

  @IsString()
  @IsIn(['S', 'N'], { message: 'Exibição no imobilizado deve ser "S" ou "N".' })
  @IsNotEmpty({ message: 'Exibição no imobilizado é obrigatório.' })
  produtos_exibe_no_imobilizado: string;

  @IsString()
  @IsIn(['S', 'N'], { message: 'Impressão de preparo deve ser "S" ou "N".' })
  @IsNotEmpty({ message: 'Impressão de preparo é obrigatório.' })
  produtos_impressao_preparo: string;

  @IsString()
  @IsIn(['S', 'N'], { message: 'Notificação de estoque deve ser "S" ou "N".' })
  @IsNotEmpty({ message: 'Notificação de estoque é obrigatório.' })
  produtos_notificacao_estoque: string;

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 3 })
  @Min(0, { message: 'Mililitros deve ser maior ou igual a 0.' })
  // @IsNotEmpty({ message: 'Mililitros é obrigatório.' })
  produtos_ml: number;

  @IsInt()
  @IsOptional()
  produtos_ponto_processo?: number;

  @IsString()
  @IsIn(['S', 'N'], {
    message: 'Retirada automática na entrada deve ser "S" ou "N".',
  })
  @IsNotEmpty({ message: 'Retirada automática na entrada é obrigatório.' })
  produtos_retirada_automatica_na_entrada: string;

  @IsString()
  @IsIn(['S', 'N'], { message: 'Venda online deve ser "S" ou "N".' })
  @IsNotEmpty({ message: 'Venda online é obrigatório.' })
  produtos_venda_online: string;

  @IsString()
  @MaxLength(10, {
    message: 'Unidade de medida deve ter no máximo 10 caracteres.',
  })
  @IsOptional()
  produtos_unidade_medida?: string;
}

export class ProdutosCrudDto {
  // @IsNotEmpty({ message: 'A lista de produtos não pode estar vazia.' })
  // produto: ProdutoCrudDto[];
  // @IsArray()
  @IsNotEmpty()
  produto: ProdutoCrudDto;
}
