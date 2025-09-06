export class PontosEntregasListRespostaDto {
  pontosentregas_id: number;
  pontosentregas_nome: string;

  constructor(data: Partial<PontosEntregasListRespostaDto>) {
    Object.assign(this, data);
  }
}
