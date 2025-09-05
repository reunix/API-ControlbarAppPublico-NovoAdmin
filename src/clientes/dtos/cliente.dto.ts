import { IsString, IsOptional } from 'class-validator';

export class BuscarClienteDto {
  @IsString()
  @IsOptional()
  nome?: string;
}

export class ClienteRespostaDto {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  telefone: string;
  cnpj: string;
  telefone1: string;
  email: string;

  constructor(props: Partial<ClienteRespostaDto>) {
    Object.assign(this, props);
  }
}
