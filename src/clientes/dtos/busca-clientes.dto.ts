import { IsString, IsOptional } from 'class-validator';

export class BuscaClientesDto {
  @IsString()
  @IsOptional()
  nome: string;
}
