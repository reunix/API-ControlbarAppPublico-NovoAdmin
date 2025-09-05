import { IsString } from 'class-validator';

export class BuscaEventosDto {
  @IsString()
  empresaId: string;
}
