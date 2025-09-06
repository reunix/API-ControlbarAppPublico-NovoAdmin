import { RespostaParamsAppVendasPublico } from '../dtos/params-app-vendas-publico-resposta.dto';
import { EventoAbertosRespostaDto } from '../dtos/eventosAbertos-resposta.dto';
import { EventosAbertosAppVendasPublico } from '../dtos/eventos-abertos-app-publico-resposta.dto';

export interface EventosRepositorio {
  buscarEventosAbertos(): Promise<EventoAbertosRespostaDto[]>;
  buscarParmsLoginAppPublico(
    idEvento: number
  ): Promise<RespostaParamsAppVendasPublico>;
  buscarEventosAbertosAppPublico(): Promise<EventosAbertosAppVendasPublico[]>;
}
