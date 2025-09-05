// eventos-abertos-resposta.dto.ts
export class EventoAbertosRespostaDto {
  eventos_id: number;
  eventos_nome: string;
  clientes_id: number;
  clientes_nome: string;
  clientes_cpfcnpj: string | null;
  eventos_endereco: string | null;
  eventos_numero: string | null;
  eventos_bairro: string | null;
  eventos_cidade: string | null;
  eventos_vendacartao: string;
  eventos_controla_garcom: string;
  eventos_restaurante: string;
  eventos_vendas_online: string;
  eventos_finalizado: string;
  eventos_uf: string | null;
  eventos_imagem: string;
  qtdPdvs: number;
  qtdBeeps: number;
  ultimavenda: string | null;
  data: string;
  qtdProdsAlertaVendas: number;

  constructor(data: Partial<EventoAbertosRespostaDto>) {
    Object.assign(this, data);
  }
}
