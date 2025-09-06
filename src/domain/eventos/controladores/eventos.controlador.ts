import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
  HttpCode,
  Get,
  Param,
} from '@nestjs/common';
import { EventosRepositorio } from '../interfaces/eventos-repositorio.interface';
import { EventoAbertosRespostaDto } from '../dtos/eventosAbertos-resposta.dto';
import { RespostaParamsAppVendasPublico } from '../dtos/params-app-vendas-publico-resposta.dto';
import { EventosAbertosAppVendasPublico } from '../dtos/eventos-abertos-app-publico-resposta.dto';

@Controller('eventos')
export class EventosControlador {
  private readonly logger = new Logger(EventosControlador.name);

  constructor(
    @Inject('EventosRepositorio')
    private readonly repositorio: EventosRepositorio
  ) {}

  @Post('abertos')
  @HttpCode(HttpStatus.OK) // Força o status 200 OK
  @UsePipes(new ValidationPipe({ transform: true }))
  async buscarEventosAbertos(): Promise<EventoAbertosRespostaDto[]> {
    try {
      const eventosAbertos: EventoAbertosRespostaDto[] =
        await this.repositorio.buscarEventosAbertos();

      return eventosAbertos;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar eventos abertos: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao buscar eventos abertos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('evento-params-app-publico/:eventId')
  @HttpCode(HttpStatus.OK)
  async buscarParamsLoginAppPublico(
    @Param('eventId') eventoId: string
  ): Promise<RespostaParamsAppVendasPublico> {
    try {
      const eventIdNumber = parseInt(eventoId, 10);
      if (isNaN(eventIdNumber)) {
        throw new HttpException(
          'ID do evento inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      const paramsAppPublico: RespostaParamsAppVendasPublico =
        await this.repositorio.buscarParmsLoginAppPublico(eventIdNumber);

      return paramsAppPublico;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar parâmetros do app ${eventoId}: ${errorMessage}`,
        errorStack
      );

      throw new HttpException(
        'Erro ao buscar parâmetros do app',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('eventos-abertos-app-publico')
  @HttpCode(HttpStatus.OK)
  async buscarEventosAbertosAppPublico() // @Param('eventId') eventoId: string
  : Promise<EventosAbertosAppVendasPublico[]> {
    try {
      // const eventIdNumber = parseInt(eventoId, 10);
      // if (isNaN(eventIdNumber)) {
      //   throw new HttpException(
      //     'ID do evento inválido',
      //     HttpStatus.BAD_REQUEST
      //   );
      // }

      const paramsAppPublico: EventosAbertosAppVendasPublico[] =
        await this.repositorio.buscarEventosAbertosAppPublico();

      return paramsAppPublico;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar eventos abertos : ${errorMessage}`,
        errorStack
      );

      throw new HttpException(
        'Erro ao buscar eventos abertos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
