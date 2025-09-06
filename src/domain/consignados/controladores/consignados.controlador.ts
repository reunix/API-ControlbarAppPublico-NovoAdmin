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
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { ConsignadosListRepositorio } from '../interfaces/consignados-list-repositorio.interface';
import { ConsignadosAddUpdateRepositorio } from '../interfaces/consignados-addupdate-repositorio.interface';
import { ConsignadosListRespostaDto } from '../dtos/consignadosList-resposta.dto';
import { AtualizaConsignadosDto } from '../dtos/atualiza-consignados.dto';

@Controller('consignados')
export class ConsignadosControlador {
  private readonly logger = new Logger(ConsignadosControlador.name);

  constructor(
    @Inject('ConsignadosListRepositorio')
    private readonly repositorioConsignados: ConsignadosListRepositorio,
    @Inject('ConsignadosAddUpdateRepositorio')
    private readonly repositorioAddUPdateConsignados: ConsignadosAddUpdateRepositorio
  ) {}

  @Get(':eventId/consignados')
  @HttpCode(HttpStatus.OK)
  async buscarConsignadosPorEvento(
    @Param('eventId') eventoId: string
  ): Promise<ConsignadosListRespostaDto[]> {
    try {
      const eventIdNumber = parseInt(eventoId, 10);
      if (isNaN(eventIdNumber)) {
        throw new HttpException(
          'ID do evento inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      const consignados: ConsignadosListRespostaDto[] =
        await this.repositorioConsignados.buscarProdutosParaConsignados(
          eventIdNumber
        );

      return consignados;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar consignados do evento ${eventoId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao buscar consignados',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/addupdate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async atualizarConsignados(
    @Body() atualizaConsignadosDto: AtualizaConsignadosDto
  ): Promise<void> {
    try {
      const { consignados } = atualizaConsignadosDto;

      // Validar se o array de consignados não está vazio
      if (!consignados || consignados.length === 0) {
        throw new HttpException(
          'Nenhum consignado fornecido para atualização',
          HttpStatus.BAD_REQUEST
        );
      }

      // Chamar o método do repositório para atualizar os consignados
      await this.repositorioAddUPdateConsignados.atualizarConsignados(
        consignados
      );

      // this.logger.log(`Consignados atualizados com sucesso.`);
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao atualizar consignados: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao atualizar consignados',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':consignadoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletarEventoDespesa(
    @Param('consignadoId') consignadoId: string
  ): Promise<void> {
    try {
      const consignadoIdNumber = parseInt(consignadoId, 10);
      if (isNaN(consignadoIdNumber)) {
        throw new HttpException(
          'ID da despesa inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.repositorioAddUPdateConsignados.deletarConsignado(
        consignadoIdNumber
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao excluir consignado ${consignadoId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao excluir consignado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
