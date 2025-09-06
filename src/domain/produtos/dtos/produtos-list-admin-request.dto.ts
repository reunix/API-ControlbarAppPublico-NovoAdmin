import { IsString } from 'class-validator';

export class BuscaProdutosAdminDto {
    @IsString()
    eventoId: string;
  clienteId: string;
  somenteComAlertas: boolean;
   somenteComEntradas: boolean;
  recuperarDadosAgregados: boolean;
}
