import {
  Controller,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
  HttpCode,
  Param,
  Body,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Post,
} from '@nestjs/common';
import { ComposicoesListRepositorio } from '../interfaces/produtoscomposicao-list-repositorio.interface';
import { ProdutosComposicaoCrudRepositorio } from '../interfaces/produtoscomposicao-crud-repositorio.interface';
import { ProdutosComposicaoListAdminRespostaDto } from '../dtos/produtoscomposicao-list-admin-resposta.dto';
import { AtualizaProdutosComposicoesDto } from '../dtos/atualiza-produtoscomposicao.dto';
import { BuscaComposicoesAdminDto } from '../dtos/composicao-list-admin-request.dto';

@Controller('composicoes')
export class ProdutosComposicaoControlador {
  private readonly logger = new Logger(ProdutosComposicaoControlador.name);

  constructor(
    @Inject('ProdutosComposicaoListRepositorio')
    private readonly repositorioProdutosEntradas: ComposicoesListRepositorio,
    @Inject('ProdutosComposicaoCrudRepositorio')
    private readonly repositorioCrudProdutoentradas: ProdutosComposicaoCrudRepositorio
  ) {}

  @Post('composicoesandprodutos')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async buscaComposicoes(
    @Body() buscaComposicao: BuscaComposicoesAdminDto
  ): Promise<ProdutosComposicaoListAdminRespostaDto> {
    try {
      const produtoIdNumber = parseInt(buscaComposicao.produtoId, 10);
      const eventoIdNumber = parseInt(buscaComposicao.eventoId, 10);
      if (isNaN(produtoIdNumber) || isNaN(eventoIdNumber)) {
        throw new HttpException(
          'IDs para pesquisar composições inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      const composiçõesAndProdutos: ProdutosComposicaoListAdminRespostaDto =
        await this.repositorioProdutosEntradas.buscarComposicoes(
          produtoIdNumber,
          eventoIdNumber
        );

      return composiçõesAndProdutos;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao buscar composições do produto ${buscaComposicao.produtoId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao buscar composições do produto',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/addupdate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async atualizarComposicoes(
    @Body() atualizaProdutoEntradaDto: AtualizaProdutosComposicoesDto
  ): Promise<void> {
    try {
      const { composicoes } = atualizaProdutoEntradaDto;

      // console.log('entradasProdutos', entradasProdutos);

      // Validar se o array de despesas não está vazio
      if (!composicoes || composicoes.length === 0) {
        throw new HttpException(
          'Nenhuma composição fornecida para atualização',
          HttpStatus.BAD_REQUEST
        );
      }

      // Chamar o método do repositório para atualizar as despesas
      await this.repositorioCrudProdutoentradas.atualizarComposicoes(
        composicoes
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao atualizar composições: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao atualizar composições',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':entradaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletarComposicao(
    @Param('entradaId') entradaId: string
  ): Promise<void> {
    try {
      const entradaIdNumber = parseInt(entradaId, 10);
      if (isNaN(entradaIdNumber)) {
        throw new HttpException(
          'ID da composição inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.repositorioCrudProdutoentradas.deletarComposicao(
        entradaIdNumber
      );
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido';
      let errorStack: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      this.logger.error(
        `Erro ao excluir composição ${entradaId}: ${errorMessage}`,
        errorStack
      );
      throw new HttpException(
        'Erro ao excluir composição',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
