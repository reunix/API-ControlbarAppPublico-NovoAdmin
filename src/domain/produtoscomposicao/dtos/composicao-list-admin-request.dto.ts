import { IsString } from 'class-validator';

export class BuscaComposicoesAdminDto {
  @IsString()
  produtoId: string;
  eventoId: string;
}
