import { IsArray, IsInt, IsNotEmpty, Min } from 'class-validator';

export class AtualizaConsignadoDto {
  @IsInt()
  @IsNotEmpty()
  produtoId: number;

  @IsInt()
  consignado_id: number;

  @IsNotEmpty()
  produtoNome: string;

  @IsInt()
  @Min(0)
  qtdEntradas: number;

  @IsInt()
  @Min(0)
  qtdSaidas: number;

  @IsInt()
  saldo: number;

  @IsInt()
  @Min(0)
  devolucaoBar: number;

  @IsInt()
  @Min(0)
  devolucaoFornecedor: number;

  @IsInt()
  qtdDiferenca: number;

  @IsInt()
  @IsNotEmpty()
  produtos_evento: number; // Alterado de idEvento para produtos_evento
}

export class AtualizaConsignadosDto {
  @IsArray()
  @IsNotEmpty()
  consignados: AtualizaConsignadoDto[];
}
