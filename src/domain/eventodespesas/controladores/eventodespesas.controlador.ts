import {
  Controller,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
  HttpCode,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventoDespesasListRepositorio } from '../interfaces/eventodespesas-list-repositorio.interface';
import { EventoDespesasCrudRepositorio } from '../interfaces/eventodespesas-addupdate-repositorio.interface';
import { EventoDespesasListRespostaDto } from '../dtos/eventodespesasList-resposta.dto';
import { AtualizaEventoDespesasDto } from '../dtos/atualiza-eventodespesas.dto';

@Controller('eventodespesas')
export class EventoDespesasControlador {
  private readonly logger = new Logger(EventoDespesasControlador.name);

  constructor(
    @Inject('EventoDespesasListRepositorio')
    private readonly repositorioEventoDespesas: EventoDespesasListRepositorio,
    @Inject('EventoDespesasCrudRepositorio')
    private readonly repositorioCrudEventoDespesas: EventoDespesasCrudRepositorio
  ) {}

  @Get(':eventId/eventodespesas')
  @HttpCode(HttpStatus.OK)
  async buscarDespesasPorEvento(
    @Param('eventId') eventoId: string
  ): Promise<EventoDespesasListRespostaDto[]> {
    try {
      const eventIdNumber = parseInt(eventoId, 10);
      if (isNaN(eventIdNumber)) {
        throw new HttpException(
          'ID do evento inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      const despesas: EventoDespesasListRespostaDto[] =
        await this.repositorioEventoDespesas.buscarEventoDespesas(
          eventIdNumber
        );

      return despesas;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar despesas do evento ${eventoId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao buscar despesas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/addupdate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async atualizarEventoDespesas(
    @Body() atualizaEventoDespesasDto: AtualizaEventoDespesasDto
  ): Promise<void> {
    try {
      const { despesas } = atualizaEventoDespesasDto;

      // Validar se o array de despesas não está vazio
      if (!despesas || despesas.length === 0) {
        throw new HttpException(
          'Nenhuma despesa fornecida para atualização',
          HttpStatus.BAD_REQUEST
        );
      }

      // Chamar o método do repositório para atualizar as despesas
      await this.repositorioCrudEventoDespesas.atualizarEventoDespesas(
        despesas
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao atualizar despesas: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao atualizar despesas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':despesasId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletarEventoDespesa(
    @Param('despesasId') despesasId: string
  ): Promise<void> {
    try {
      const despesasIdNumber = parseInt(despesasId, 10);
      if (isNaN(despesasIdNumber)) {
        throw new HttpException(
          'ID da despesa inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.repositorioCrudEventoDespesas.deletarEventoDespesa(
        despesasIdNumber
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao excluir despesa ${despesasId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao excluir despesa',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
