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
import { DistribuicaoListAdminRepositorio } from '../interfaces/distribuicao-list-repositorio.interface';
import { DistribuicaoCrudRepositorio } from '../interfaces/distribuicao-addupdate-repositorio.interface';
import { DistribuicaoListRespostaDto } from '../dtos/distribuicaoList-resposta.dto';
import { AtualizaDistribuicoesDto } from '../dtos/atualiza-distribuicao.dto';

@Controller('distribuicao')
export class DistribuicaoControlador {
  private readonly logger = new Logger(DistribuicaoControlador.name);

  constructor(
    @Inject('DistribuicaoListRepositorio')
    private readonly repositorioEventoDespesas: DistribuicaoListAdminRepositorio,
    @Inject('DistribuicaoCrudRepositorio')
    private readonly repositorioCrudEventoDespesas: DistribuicaoCrudRepositorio
  ) {}

  @Get(':productId/listadistribuicaoadmin')
  @HttpCode(HttpStatus.OK)
  async buscarDespesasPorEvento(
    @Param('productId') productId: string
  ): Promise<DistribuicaoListRespostaDto[]> {
    try {
      const productIdNumber = parseInt(productId, 10);
      if (isNaN(productIdNumber)) {
        throw new HttpException(
          'ID do produto inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      const distribuicoes: DistribuicaoListRespostaDto[] =
        await this.repositorioEventoDespesas.buscarDistribuicoesProdutoAdmin(
          productIdNumber
        );

      return distribuicoes;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar distribuição do produto ${productId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao buscar distribuição',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/addupdate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async atualizarEventoDespesas(
    @Body() atualizaEventoDespesasDto: AtualizaDistribuicoesDto
  ): Promise<void> {
    try {
      const { distribuicao } = atualizaEventoDespesasDto;

      // Validar se o array de despesas não está vazio
      if (!distribuicao || distribuicao.length === 0) {
        throw new HttpException(
          'Nenhuma distribuição fornecida para atualização',
          HttpStatus.BAD_REQUEST
        );
      }

      // Chamar o método do repositório para atualizar as despesas
      await this.repositorioCrudEventoDespesas.atualizarDistribuicao(
        distribuicao
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao atualizar distribuição: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao atualizar distribuição',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':distribuicaoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletarEventoDespesa(
    @Param('distribuicaoId') distribuicaoId: string
  ): Promise<void> {
    try {
      const distribuicaoIdNumber = parseInt(distribuicaoId, 10);
      if (isNaN(distribuicaoIdNumber)) {
        throw new HttpException(
          'ID da despesa inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.repositorioCrudEventoDespesas.deletarDistribuicao(
        distribuicaoIdNumber
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao excluir distribuição ${distribuicaoId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao excluir distribuição',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
