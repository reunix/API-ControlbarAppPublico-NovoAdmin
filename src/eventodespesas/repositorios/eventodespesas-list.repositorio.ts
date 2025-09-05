import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventoDespesasListRepositorio } from '../interfaces/eventodespesas-list-repositorio.interface';
import { EventoDespesasListRespostaDto } from '../dtos/eventodespesasList-resposta.dto';

@Injectable()
export class EventoDespesasListRepositorioImpl
  implements EventoDespesasListRepositorio
{
  constructor(
    @InjectRepository(EventoDespesasListRespostaDto)
    private readonly repositorio: Repository<EventoDespesasListRespostaDto>
  ) {}

  async buscarEventoDespesas(
    eventoId: number
  ): Promise<EventoDespesasListRespostaDto[]> {
    const sql = `
        SELECT despesas_id, 
        despesas_evento, 
        DATE_FORMAT(despesas_data, '%d/%m/%Y %H:%i') AS despesas_data,
        despesas_valor, 
        despesas_quantidade,   
        (despesas_valor * despesas_quantidade) as subtotal,
        despesas_tipo_despesa ,
        despesas_descricao 
        FROM despesas 
        WHERE despesas_evento = ? 
        ORDER BY despesas_descricao  `;

    try {
      const produtos: EventoDespesasListRespostaDto[] =
        await this.repositorio.query(sql, [eventoId]);

      return produtos;
    } catch (error) {
      console.error('Erro ao buscar despesas do evento:', error);
      throw new Error('Erro ao executar a consulta de despesas');
    }
  }
}
